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
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const categories_service_1 = require("./categories.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth-guard");
const admin_guard_1 = require("../products/guards/admin.guard");
const category_dto_1 = require("./dto/category.dto");
let CategoriesController = class CategoriesController {
    categoriesService;
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    async findTree() {
        return this.categoriesService.findTree();
    }
    async findAll(query) {
        return this.categoriesService.findAll(query);
    }
    async findOne(slug) {
        return this.categoriesService.findBySlug(slug);
    }
    async findProducts(slug, query) {
        return this.categoriesService.findProducts(slug, query);
    }
    async create(dto) {
        return this.categoriesService.create(dto);
    }
    async update(id, dto) {
        return this.categoriesService.update(id, dto);
    }
    async delete(id) {
        return this.categoriesService.delete(id);
    }
};
exports.CategoriesController = CategoriesController;
__decorate([
    (0, common_1.Get)('tree'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get full category tree',
        description: 'Returns all categories as a nested tree. Each root category contains ' +
            'a "children" array with its subcategories. Useful for navigation menus.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Nested category tree' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findTree", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List all categories',
        description: 'Returns a flat paginated list of categories. Use rootOnly=true to get ' +
            'only top-level categories. Use withCounts=true to include product and ' +
            'subcategory counts per category.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Paginated list of categories' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({
        name: 'rootOnly',
        required: false,
        type: Boolean,
        description: 'Return only top-level categories',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'withCounts',
        required: false,
        type: Boolean,
        description: 'Include product and subcategory counts',
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.CategoriesQueryDto]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':slug'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get category by slug',
        description: 'Returns a single category with its parent category and direct children. ' +
            'Also includes product count and children count.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Category with parent and children' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Category not found' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':slug/products'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Get products by category',
        description: 'Returns paginated products belonging to the given category. ' +
            'Set includeSubcategories=true to also include products from child ' +
            'subcategories (e.g. fetching all "Clothing" products includes T-Shirts, ' +
            'Hoodies, Bags, etc.).',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Paginated product list for this category' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Category not found' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({
        name: 'includeSubcategories',
        required: false,
        type: Boolean,
        description: 'Also return products from child categories',
    }),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, category_dto_1.CategoryProductsQueryDto]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findProducts", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a category (admin)',
        description: 'Creates a new category. Provide a parentId to make it a subcategory. ' +
            'Slug is auto-generated from name if not provided. Requires ADMIN role.',
    }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Category created successfully' }),
    (0, swagger_1.ApiConflictResponse)({ description: 'Slug already exists' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Parent category not found' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Requires ADMIN role' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a category (admin)',
        description: 'Updates a category. All fields are optional — only send what changes. ' +
            'To promote a subcategory to root level, set parentId to null. ' +
            'Requires ADMIN role.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Category updated successfully' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Category or parent not found' }),
    (0, swagger_1.ApiConflictResponse)({ description: 'New slug already in use' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Requires ADMIN role' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a category (admin)',
        description: 'Deletes a category. Will be rejected (422) if the category has any ' +
            'products assigned to it or has subcategories. You must reassign or ' +
            'delete those first. Requires ADMIN role.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Category deleted successfully' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Category not found' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({
        description: 'Category has products or subcategories',
    }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Requires ADMIN role' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "delete", null);
exports.CategoriesController = CategoriesController = __decorate([
    (0, swagger_1.ApiTags)('categories'),
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService])
], CategoriesController);
//# sourceMappingURL=categories.controller.js.map