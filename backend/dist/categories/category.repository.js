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
exports.CategoryRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let CategoryRepository = class CategoryRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page = 1, limit = 20, rootOnly = false, withCounts = false, } = query;
        const skip = (page - 1) * limit;
        const where = {
            ...(rootOnly ? { parentId: null } : {}),
        };
        const [categories, total] = await this.prisma.$transaction([
            this.prisma.category.findMany({
                where,
                skip,
                take: limit,
                orderBy: { name: 'asc' },
                include: {
                    parent: {
                        select: { id: true, name: true, slug: true },
                    },
                    _count: withCounts
                        ? { select: { children: true, products: true } }
                        : undefined,
                },
            }),
            this.prisma.category.count({ where }),
        ]);
        return {
            data: categories,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
            },
        };
    }
    async findTree() {
        const all = await this.prisma.category.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: { select: { products: true } },
            },
        });
        const map = new Map();
        all.forEach((cat) => {
            map.set(cat.id, { ...cat, children: [] });
        });
        const roots = [];
        map.forEach((cat) => {
            if (cat.parentId) {
                const parent = map.get(cat.parentId);
                if (parent) {
                    parent.children.push(cat);
                }
            }
            else {
                roots.push(cat);
            }
        });
        return roots;
    }
    async findBySlug(slug) {
        return this.prisma.category.findUnique({
            where: { slug },
            include: {
                parent: { select: { id: true, name: true, slug: true } },
                children: {
                    select: { id: true, name: true, slug: true, description: true },
                    orderBy: { name: 'asc' },
                },
                _count: { select: { products: true, children: true } },
            },
        });
    }
    async findById(id) {
        return this.prisma.category.findUnique({ where: { id } });
    }
    async findProductsBySlug(slug, query) {
        const { page = 1, limit = 20, includeSubcategories = false } = query;
        const skip = (page - 1) * limit;
        const category = await this.prisma.category.findUnique({
            where: { slug },
            include: {
                children: { select: { id: true } },
            },
        });
        if (!category)
            return null;
        let categoryIds = [category.id];
        const categoryTyped = category;
        if (includeSubcategories && categoryTyped.children?.length > 0) {
            categoryIds = [
                categoryTyped.id,
                ...categoryTyped.children.map((c) => c.id),
            ];
        }
        const where = {
            categoryId: { in: categoryIds },
            isActive: true,
        };
        const [products, total] = await this.prisma.$transaction([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    variants: {
                        where: { stockQuantity: { gt: 0 } },
                        select: {
                            id: true,
                            size: true,
                            color: true,
                            priceOverride: true,
                            stockQuantity: true,
                            images: true,
                        },
                        take: 6,
                    },
                    _count: { select: { reviews: true } },
                },
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            category: {
                id: category.id,
                name: category.name,
                slug: category.slug,
                description: category.description ?? '',
            },
            data: products,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
            },
        };
    }
    async create(dto) {
        try {
            return await this.prisma.category.create({
                data: {
                    name: dto.name,
                    slug: dto.slug,
                    description: dto.description,
                    parentId: dto.parentId ?? null,
                },
                include: {
                    parent: { select: { id: true, name: true, slug: true } },
                },
            });
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.InternalServerErrorException(`Unique constraint failed on: ${error.meta?.target}`);
            }
            throw error;
        }
    }
    async update(id, data) {
        return this.prisma.category.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.slug !== undefined && { slug: data.slug }),
                ...(data.description !== undefined && {
                    description: data.description,
                }),
                ...('parentId' in data && { parentId: data.parentId ?? null }),
            },
            include: {
                parent: { select: { id: true, name: true, slug: true } },
                children: { select: { id: true, name: true, slug: true } },
                _count: { select: { products: true } },
            },
        });
    }
    async delete(id) {
        return this.prisma.category.delete({ where: { id } });
    }
    async slugExists(slug, excludeId) {
        const found = await this.prisma.category.findFirst({
            where: {
                slug,
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
            select: { id: true },
        });
        return !!found;
    }
    async hasProducts(id) {
        const count = await this.prisma.product.count({
            where: { categoryId: id },
        });
        return count > 0;
    }
    async hasChildren(id) {
        const count = await this.prisma.category.count({
            where: { parentId: id },
        });
        return count > 0;
    }
};
exports.CategoryRepository = CategoryRepository;
exports.CategoryRepository = CategoryRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoryRepository);
//# sourceMappingURL=category.repository.js.map