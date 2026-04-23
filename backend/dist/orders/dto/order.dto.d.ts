export declare enum OrderStatusEnum {
    PENDING = "PENDING",
    PAID = "PAID",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}
export declare class OrdersQueryDto {
    page?: number;
    limit?: number;
    status?: OrderStatusEnum;
}
export declare class UpdateOrderStatusDto {
    status: OrderStatusEnum;
    trackingNumber?: string;
    note?: string;
}
