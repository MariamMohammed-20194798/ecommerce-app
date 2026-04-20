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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const product_service_1 = require("./product.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth-guard");
const admin_guard_1 = require("./guards/admin.guard");
const product_dto_1 = require("./dto/product.dto");
let ProductController = class ProductController {
    productService;
    constructor(productService) {
        this.productService = productService;
    }
    async search(query) {
        return this.productService.search(query);
    }
    async findAll(query) {
        return this.productService.findAll(query);
    }
    async findOne(slug) {
        return this.productService.findBySlug(slug);
    }
    async findReviews(id, query) {
        return this.productService.findReviews(id, query);
    }
    async create(dto) {
        return this.productService.create(dto);
    }
    async update(id, dto) {
        return this.productService.update(id, dto);
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Get)('search'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Full-text product search',
        description: 'Searches product names and descriptions using PostgreSQL pg_trgm + tsvector. ' +
            'Requires the pg_trgm extension and a GIN index on the products table.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Paginated search results' }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: true, description: 'Search term' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_dto_1.SearchQueryDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List all products',
        description: 'Returns a paginated list of active products. Supports filtering by ' +
            'category (slug or ID), size, color, price range, and sort order.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Paginated product list with metadata' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'size', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'color', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'priceMin', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'priceMax', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({
        name: 'sort',
        required: false,
        enum: ['price_asc', 'price_desc', 'newest', 'popular', 'rating'],
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_dto_1.ProductsQueryDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':slug'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get product by slug',
        description: 'Returns full product detail including all variants and the most ' +
            'recent 5 reviews. Use the slug (SEO-friendly URL) not the UUID.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Product with variants and reviews' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Product not found' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/reviews'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get reviews for a product',
        description: 'Returns paginated reviews for the given product UUID, with ' +
            'average rating and total count in the response metadata.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Paginated reviews with rating summary' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Product not found' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({
        name: 'rating',
        required: false,
        type: Number,
        description: '1–5',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, product_dto_1.ReviewsQueryDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "findReviews", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a product (admin)',
        description: 'Creates a new product and optionally its variants in a single request. ' +
            'Slug is auto-generated from the name if not provided. ' +
            'Requires ADMIN role.',
    }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Product created successfully' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Requires ADMIN role' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_dto_1.CreateProductDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a product (admin)',
        description: 'Updates product fields. All fields are optional — send only what needs changing. ' +
            'To manage variants, use the /products/:id/variants endpoints. ' +
            'Requires ADMIN role.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Product updated successfully' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Product not found' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Requires ADMIN role' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "update", null);
exports.ProductController = ProductController = __decorate([
    (0, swagger_1.ApiTags)('products'),
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
//# sourceMappingURL=product.controller.js.map