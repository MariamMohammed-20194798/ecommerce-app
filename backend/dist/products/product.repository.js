"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const client_1 = require("@prisma/client");
const product_dto_1 = require("./dto/product.dto");
let ProductRepository = class ProductRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    buildOrderBy(sort = product_dto_1.SortField.NEWEST) {
        switch (sort) {
            case product_dto_1.SortField.PRICE_ASC:
                return { basePrice: 'asc' };
            case product_dto_1.SortField.PRICE_DESC:
                return { basePrice: 'desc' };
            case product_dto_1.SortField.NEWEST:
                return { createdAt: 'desc' };
            case product_dto_1.SortField.RATING:
                return { reviews: { _count: 'desc' } };
            case product_dto_1.SortField.POPULAR:
                return { variants: { _count: 'desc' } };
            default:
                return { createdAt: 'desc' };
        }
    }
    buildVariantFilter(size, color) {
        if (!size && !color)
            return undefined;
        return {
            some: {
                ...(size ? { size } : {}),
                ...(color ? { color } : {}),
                stockQuantity: { gt: 0 },
            },
        };
    }
    async findMany(query) {
        const { page = 1, limit = 20, category, size, color, priceMin, priceMax, sort, isActive = true, } = query;
        const skip = (page - 1) * limit;
        const where = {
            isActive,
            ...(category && {
                category: { OR: [{ slug: category }, { id: category }] },
            }),
            ...(priceMin !== undefined || priceMax !== undefined
                ? {
                    basePrice: {
                        ...(priceMin !== undefined ? { gte: priceMin } : {}),
                        ...(priceMax !== undefined ? { lte: priceMax } : {}),
                    },
                }
                : {}),
            ...(size || color
                ? { variants: this.buildVariantFilter(size, color) }
                : {}),
        };
        const [products, total] = await this.prisma.$transaction([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: this.buildOrderBy(sort),
                include: {
                    category: { select: { id: true, name: true, slug: true } },
                    variants: {
                        where: { stockQuantity: { gt: 0 } },
                        select: {
                            id: true,
                            sku: true,
                            size: true,
                            color: true,
                            priceOverride: true,
                            stockQuantity: true,
                            images: true,
                        },
                        take: 10,
                    },
                    _count: { select: { reviews: true } },
                },
            }),
            this.prisma.product.count({ where }),
        ]);
        const productsWithNumberPrices = products.map((product) => ({
            ...product,
            basePrice: Number(product.basePrice),
            variants: product.variants.map((variant) => ({
                ...variant,
                priceOverride: variant.priceOverride
                    ? Number(variant.priceOverride)
                    : null,
            })),
        }));
        return {
            data: productsWithNumberPrices,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
            },
        };
    }
    async findBySlug(slug) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            include: {
                category: { select: { id: true, name: true, slug: true } },
                variants: {
                    orderBy: [{ size: 'asc' }, { color: 'asc' }],
                    select: {
                        id: true,
                        sku: true,
                        size: true,
                        color: true,
                        priceOverride: true,
                        stockQuantity: true,
                        images: true,
                    },
                },
                reviews: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: { select: { id: true, email: true } },
                    },
                },
                _count: { select: { reviews: true } },
            },
        });
        if (!product) {
            return null;
        }
        return {
            ...product,
            basePrice: Number(product.basePrice),
            variants: product.variants.map((variant) => ({
                ...variant,
                priceOverride: variant.priceOverride
                    ? Number(variant.priceOverride)
                    : null,
            })),
        };
    }
    async findById(id) {
        return this.prisma.product.findUnique({ where: { id } });
    }
    async search(query) {
        const { q, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;
        const results = await this.prisma.$queryRaw `
      SELECT
        id,
        ts_rank(
          to_tsvector('english', name || ' ' || COALESCE(description, '')),
          plainto_tsquery('english', ${q})
        ) AS rank
      FROM products
      WHERE
        "isActive" = true
        AND (
          to_tsvector('english', name || ' ' || COALESCE(description, ''))
            @@ plainto_tsquery('english', ${q})
          OR similarity(name, ${q}) > 0.2
        )
      ORDER BY rank DESC, similarity(name, ${q}) DESC
      LIMIT ${limit} OFFSET ${skip}
    `;
        if (!results.length) {
            return {
                data: [],
                meta: { total: 0, page, limit, totalPages: 0, hasNextPage: false },
            };
        }
        const ids = results.map((r) => r.id);
        const products = await this.prisma.product.findMany({
            where: { id: { in: ids } },
            include: {
                category: { select: { id: true, name: true, slug: true } },
                variants: {
                    take: 5,
                    select: {
                        id: true,
                        size: true,
                        color: true,
                        priceOverride: true,
                        stockQuantity: true,
                        images: true,
                    },
                },
                _count: { select: { reviews: true } },
            },
        });
        const ranked = ids
            .map((id) => {
            const product = products.find((p) => p.id === id);
            if (!product)
                return null;
            return {
                ...product,
                basePrice: Number(product.basePrice),
                variants: product.variants.map((variant) => ({
                    ...variant,
                    priceOverride: variant.priceOverride
                        ? Number(variant.priceOverride)
                        : null,
                })),
            };
        })
            .filter(Boolean);
        const countResult = await this.prisma.$queryRaw `
      SELECT COUNT(*) FROM products
      WHERE "isActive" = true AND (
        to_tsvector('english', name || ' ' || COALESCE(description, ''))
          @@ plainto_tsquery('english', ${q})
        OR similarity(name, ${q}) > 0.2
      )
    `;
        const total = Number(countResult[0].count);
        return {
            data: ranked,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
            },
        };
    }
    async findReviews(productId, query) {
        const { page = 1, limit = 10, rating } = query;
        const skip = (page - 1) * limit;
        const where = {
            productId,
            ...(rating ? { rating } : {}),
        };
        const [reviews, total, aggregate] = await this.prisma.$transaction([
            this.prisma.review.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { id: true, email: true } },
                },
            }),
            this.prisma.review.count({ where }),
            this.prisma.review.aggregate({
                where: { productId },
                _avg: { rating: true },
                _count: { rating: true },
            }),
        ]);
        return {
            data: reviews,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                averageRating: aggregate._avg.rating
                    ? Number(aggregate._avg.rating.toFixed(1))
                    : null,
                totalReviews: aggregate._count.rating,
            },
        };
    }
    async create(dto) {
        const slug = dto.slug ??
            dto.name
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
        const product = await this.prisma.product.create({
            data: {
                name: dto.name,
                slug,
                categoryId: dto.categoryId,
                description: dto.description,
                basePrice: dto.basePrice,
                images: dto.images,
                isActive: dto.isActive ?? true,
                metadata: dto.metadata !== undefined
                    ? dto.metadata
                    : client_1.Prisma.JsonNull,
                variants: dto.variants ? { create: dto.variants } : undefined,
            },
            include: {
                category: { select: { id: true, name: true, slug: true } },
                variants: true,
            },
        });
        return {
            ...product,
            basePrice: Number(product.basePrice),
            variants: product.variants.map((variant) => ({
                ...variant,
                priceOverride: variant.priceOverride
                    ? Number(variant.priceOverride)
                    : null,
            })),
        };
    }
    async update(id, dto) {
        const product = await this.prisma.product.update({
            where: { id },
            data: {
                ...(dto.name && { name: dto.name }),
                ...(dto.categoryId && { categoryId: dto.categoryId }),
                ...(dto.images !== undefined && { images: dto.images }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.basePrice !== undefined && { basePrice: dto.basePrice }),
                ...(dto.isActive !== undefined && { isActive: dto.isActive }),
                ...(dto.metadata !== undefined && {
                    metadata: dto.metadata,
                }),
            },
            include: {
                category: { select: { id: true, name: true, slug: true } },
                variants: true,
            },
        });
        return {
            ...product,
            basePrice: Number(product.basePrice),
            variants: product.variants.map((variant) => ({
                ...variant,
                priceOverride: variant.priceOverride
                    ? Number(variant.priceOverride)
                    : null,
            })),
        };
    }
    async slugExists(slug, excludeId) {
        const product = await this.prisma.product.findFirst({
            where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
            select: { id: true },
        });
        return !!product;
    }
};
exports.ProductRepository = ProductRepository;
exports.ProductRepository = ProductRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductRepository);
//# sourceMappingURL=product.repository.js.map