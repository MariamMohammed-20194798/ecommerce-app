"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleUserRound, Info, Pencil } from "lucide-react";
import axios from "axios";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Tab = "profile" | "orders";

type UserState = {
  id: string;
  email: string;
  role: string;
  emailVerified?: boolean;
};

type Address = {
  id: string;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

type AddressFormState = {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

type Order = {
  id: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  _count?: { items: number };
};

type OrdersResponse = {
  data: Order[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

function getApiErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message) && message.length > 0) {
      return message.join(", ");
    }
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }
  return fallback;
}

function decodeToken(token: string): UserState | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload)) as {
      sub?: string;
      email?: string;
      role?: string;
    };
    if (!decoded.sub || !decoded.email) return null;
    return {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role ?? "CUSTOMER",
    };
  } catch {
    return null;
  }
}

const emptyAddressForm: AddressFormState = {
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  isDefault: false,
};

export default function AccountPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("profile");
  const [user, setUser] = useState<UserState | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [addressModalMode, setAddressModalMode] = useState<"add" | "edit" | null>(null);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<AddressFormState>(emptyAddressForm);

  const displayName = user?.email ? user.email.split("@")[0] : "User";

  const loadAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      const response = await api.get<Address[]>("/addresses");
      setAddresses(response.data);
    } catch (error) {
      setPageError(getApiErrorMessage(error, "Failed to load addresses."));
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const response = await api.get<OrdersResponse>("/orders");
      setOrders(response.data?.data ?? []);
    } catch (error) {
      setPageError(getApiErrorMessage(error, "Failed to load orders."));
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        const fromToken = decodeToken(token);
        if (fromToken) {
          setUser(fromToken);
        }
      }

      try {
        const refresh = await api.post("/auth/refresh");
        const accessToken = refresh.data?.accessToken as string | undefined;
        const backendUser = refresh.data?.user as UserState | undefined;
        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          const decoded = decodeToken(accessToken);
          if (decoded) {
            setUser((current) => ({ ...decoded, emailVerified: current?.emailVerified }));
          }
        }
        if (backendUser) {
          setUser(backendUser);
        }

        await Promise.all([loadAddresses(), loadOrders()]);
      } catch {
        localStorage.removeItem("accessToken");
        router.replace("/auth");
        return;
      } finally {
        setIsBooting(false);
      }
    };

    void bootstrap();
  }, [router]);

  const validateAddressForm = () => {
    if (
      !addressForm.line1.trim() ||
      !addressForm.city.trim() ||
      !addressForm.postalCode.trim() ||
      !addressForm.country.trim()
    ) {
      return "Please complete line1, city, postal code, and country.";
    }
    return null;
  };

  const onSubmitAddress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPageError(null);
    const validationError = validateAddressForm();
    if (validationError) {
      setPageError(validationError);
      return;
    }

    setIsSavingAddress(true);
    try {
      const payload = {
        line1: addressForm.line1.trim(),
        line2: addressForm.line2.trim() || undefined,
        city: addressForm.city.trim(),
        state: addressForm.state.trim() || undefined,
        postalCode: addressForm.postalCode.trim(),
        country: addressForm.country.trim(),
        isDefault: addressForm.isDefault,
      };

      if (addressModalMode === "edit") {
        if (!editingAddressId) return;
        await api.put(`/addresses/${editingAddressId}`, payload);
      } else {
        await api.post("/addresses", payload);
      }

      setAddressModalMode(null);
      setEditingAddressId(null);
      setAddressForm(emptyAddressForm);
      await loadAddresses();
    } catch (error) {
      setPageError(
        getApiErrorMessage(
          error,
          addressModalMode === "edit" ? "Failed to update address." : "Failed to add address.",
        ),
      );
    } finally {
      setIsSavingAddress(false);
    }
  };

  const openAddAddressModal = () => {
    setPageError(null);
    setAddressForm(emptyAddressForm);
    setEditingAddressId(null);
    setAddressModalMode("add");
  };

  const openEditAddressModal = (address: Address) => {
    setPageError(null);
    setEditingAddressId(address.id);
    setAddressForm({
      line1: address.line1,
      line2: address.line2 ?? "",
      city: address.city,
      state: address.state ?? "",
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setAddressModalMode("edit");
  };

  const onAddressModalOpenChange = (open: boolean) => {
    if (!open) {
      setAddressModalMode(null);
      setEditingAddressId(null);
      setAddressForm(emptyAddressForm);
    }
  };

  const onLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore logout API failures and clear local session anyway
    } finally {
      localStorage.removeItem("accessToken");
      delete api.defaults.headers.common.Authorization;
      router.replace("/auth");
    }
  };

  if (isBooting) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-sm text-muted-foreground">Loading account...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6 flex items-center justify-between border-b-2 border-secondary pb-4">
        <div className="flex items-center gap-15">
          <Link href="/home" className="font-heading text-2xl italic bold">
            Women&apos;S
          </Link>
          <nav className="flex items-center gap-6 text-sm mt-2">
            <button
              type="button"
              className={tab === "orders" ? "underline underline-offset-4" : ""}
              onClick={() => setTab("orders")}
            >
              Orders
            </button>
            <button
              type="button"
              className={tab === "profile" ? "underline underline-offset-4" : ""}
              onClick={() => setTab("profile")}
            >
              Profile
            </button>
          </nav>
        </div>
        <CircleUserRound className="size-6 text-foreground/80 cursor-pointer" onClick={tab === "orders" ? () => setTab("profile") : undefined} />
      </header>

      {tab === "profile" ? (
        <section className="space-y-4">
          <h1 className="text-lg font-bold">Profile</h1>

          <div className="rounded-xl bg-card/50 p-4">
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="text-sm">{displayName}</p>
            <p className="mt-2 text-sm text-muted-foreground">Email</p>
            <p className="text-sm">{user?.email ?? "Not available"}</p>
          </div>

          <div className="rounded-xl bg-card/50 p-4">
            <div className="mb-3 flex items-center justify-between ">
              <h2 className="font-semibold text-sm">Addresses</h2>
              <Dialog open={addressModalMode !== null} onOpenChange={onAddressModalOpenChange}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="text-sm font-medium text-foreground/80 hover:text-foreground"
                    onClick={openAddAddressModal}
                  >
                    + Add
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-xl bg-card p-6">
                  <DialogHeader>
                    <DialogTitle>{addressModalMode === "edit" ? "Edit address" : "Add address"}</DialogTitle>
                    <DialogDescription>
                      {addressModalMode === "edit"
                        ? "Update this address and save your changes."
                        : "Fill the fields below to save a new address."}
                    </DialogDescription>
                  </DialogHeader>
                  <form id="address-form" className="grid gap-2 md:grid-cols-2" onSubmit={onSubmitAddress}>
                    <input
                      placeholder="Line 1"
                      className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none md:col-span-2"
                      value={addressForm.line1}
                      onChange={(e) => setAddressForm((s) => ({ ...s, line1: e.target.value }))}
                    />
                    <input
                      placeholder="Line 2 (optional)"
                      className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none md:col-span-2"
                      value={addressForm.line2}
                      onChange={(e) => setAddressForm((s) => ({ ...s, line2: e.target.value }))}
                    />
                    <input
                      placeholder="City"
                      className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm((s) => ({ ...s, city: e.target.value }))}
                    />
                    <input
                      placeholder="State (optional)"
                      className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm((s) => ({ ...s, state: e.target.value }))}
                    />
                    <input
                      placeholder="Postal code"
                      className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm((s) => ({ ...s, postalCode: e.target.value }))}
                    />
                    <input
                      placeholder="Country"
                      className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none"
                      value={addressForm.country}
                      onChange={(e) => setAddressForm((s) => ({ ...s, country: e.target.value }))}
                    />
                    <label className="md:col-span-2 flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm((s) => ({ ...s, isDefault: e.target.checked }))}
                      />
                      This is my default address
                    </label>
                  </form>
                  <DialogFooter className="bg-transparent p-0 border-0 mt-2">
                    <button
                      type="button"
                      onClick={() => onAddressModalOpenChange(false)}
                      className="h-9 rounded-lg px-4 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      form="address-form"
                      disabled={isSavingAddress}
                      className="h-9 rounded-lg bg-black px-4 text-sm font-medium text-white disabled:opacity-70"
                    >
                      {isSavingAddress ? "Saving..." : "Save"}
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="mt-4 rounded-lg p-3">
              {isLoadingAddresses ? (
                <p className="text-sm text-muted-foreground">Loading addresses...</p>
              ) : addresses.length === 0 ? (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="size-4" />
                  No addresses added
                </p>
              ) : (
                <ul className="grid gap-3 md:grid-cols-2">
                  {addresses.map((address) => (
                    <li key={address.id} className="rounded-md border border-border/80 bg-card p-3 text-sm">
                      <div className="mb-2 flex items-start justify-between gap-2 text-muted-foreground">
                        <p className="font-medium">
                          {address.isDefault ? "Default address" : "Saved address"}
                        </p>
                        <button
                          type="button"
                          className="text-foreground/70 hover:text-foreground"
                          onClick={() => openEditAddressModal(address)}
                        >
                          <Pencil className="size-4 text-muted-foreground" />
                        </button>
                      </div>
                      <p className="font-medium">{address.line1}</p>
                      {address.line2 ? <p>{address.line2}</p> : null}
                      <p>
                        {address.city}
                      </p>
                      <p>{address.state ? `${address.state}` : ""} </p>
                      <p>{address.postalCode}</p>
                      <p>{address.country}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onLogout}
              className="h-9 rounded-lg border border-foreground/20 px-4 text-sm font-medium"
            >
              Sign out
            </button>
          </div>
        </section>
      ) : (
        <section className="space-y-4">
          <h1 className="text-lg font-bold">Orders</h1>
          <div className="rounded-xl bg-card/50 p-4">
            {isLoadingOrders ? (
              <p className="text-sm text-muted-foreground">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders found yet.</p>
            ) : (
              <ul className="space-y-3">
                {orders.map((order) => (
                  <li key={order.id} className="rounded-lg bg-card p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-xs">{order.status}</p>
                    </div>
                    <p className="text-muted-foreground">
                      Items: {order._count?.items ?? 0} • Total: ${order.totalAmount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {pageError ? <p className="mt-4 text-sm text-red-600">{pageError}</p> : null}
    </main>
  );
}
