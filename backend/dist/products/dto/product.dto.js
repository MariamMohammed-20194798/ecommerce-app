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
exports.UpdateProductDto = exports.CreateProductDto = exports.CreateVariantDto = exports.ReviewsQueryDto = exports.SearchQueryDto = exports.ProductsQueryDto = exports.SortField = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var SortField;
(function (SortField) {
    SortField["PRICE_ASC"] = "price_asc";
    SortField["PRICE_DESC"] = "price_desc";
    SortField["NEWEST"] = "newest";
    SortField["POPULAR"] = "popular";
    SortField["RATING"] = "rating";
})(SortField || (exports.SortField = SortField = {}));
class ProductsQueryDto {
    page = 1;
    limit = 20;
    category;
    size;
    color;
    priceMin;
    priceMax;
    sort = SortField.NEWEST;
    isActive = true;
}
exports.ProductsQueryDto = ProductsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Page number', default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ProductsQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Items per page', default: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], ProductsQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Category slug or ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductsQueryDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by size', example: 'M' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductsQueryDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by color', example: 'black' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ProductsQueryDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Minimum price in cents', example: 1000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ProductsQueryDto.prototype, "priceMin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum price in cents',
        example: 10000,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ProductsQueryDto.prototype, "priceMax", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: SortField, default: SortField.NEWEST }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(SortField),
    __metadata("design:type", String)
], ProductsQueryDto.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter active only', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ProductsQueryDto.prototype, "isActive", void 0);
class SearchQueryDto {
    q;
    page = 1;
    limit = 20;
}
exports.SearchQueryDto = SearchQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Search query string' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], SearchQueryDto.prototype, "q", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SearchQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], SearchQueryDto.prototype, "limit", void 0);
class ReviewsQueryDto {
    page = 1;
    limit = 10;
    rating;
}
exports.ReviewsQueryDto = ReviewsQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ReviewsQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], ReviewsQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Filter by rating', example: 5 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], ReviewsQueryDto.prototype, "rating", void 0);
class CreateVariantDto {
    sku;
    size;
    color;
    priceOverride;
    stockQuantity;
    images;
}
exports.CreateVariantDto = CreateVariantDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TSHIRT-BLK-M' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateVariantDto.prototype, "sku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'M' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVariantDto.prototype, "size", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'black' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVariantDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Price override in cents' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateVariantDto.prototype, "priceOverride", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateVariantDto.prototype, "stockQuantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [String], description: 'S3 image URLs' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateVariantDto.prototype, "images", void 0);
class CreateProductDto {
    name;
    slug;
    categoryId;
    description;
    basePrice;
    isActive = true;
    metadata;
    variants;
}
exports.CreateProductDto = CreateProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Classic Black Tee' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'classic-black-tee' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category UUID' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateProductDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Base price in cents', example: 2999 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "basePrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProductDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Extra metadata as JSON' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateProductDto.prototype, "metadata", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [CreateVariantDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateVariantDto),
    __metadata("design:type", Array)
], CreateProductDto.prototype, "variants", void 0);
class UpdateProductDto {
    name;
    categoryId;
    description;
    basePrice;
    isActive;
    metadata;
}
exports.UpdateProductDto = UpdateProductDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "basePrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateProductDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateProductDto.prototype, "metadata", void 0);
//# sourceMappingURL=product.dto.js.map