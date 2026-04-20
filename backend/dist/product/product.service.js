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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const product_repository_1 = require("./product.repository");
let ProductService = class ProductService {
    productsRepo;
    constructor(productsRepo) {
        this.productsRepo = productsRepo;
    }
    async findAll(query) {
        return this.productsRepo.findMany(query);
    }
    async findBySlug(slug) {
        const product = await this.productsRepo.findBySlug(slug);
        if (!product) {
            throw new common_1.NotFoundException(`Product with slug "${slug}" was not found.`);
        }
        return product;
    }
    async search(query) {
        return this.productsRepo.search(query);
    }
    async findReviews(productId, query) {
        const product = await this.productsRepo.findById(productId);
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID "${productId}" was not found.`);
        }
        return this.productsRepo.findReviews(productId, query);
    }
    async create(dto) {
        const slug = dto.slug ??
            dto.name
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
        const exists = await this.productsRepo.slugExists(slug);
        if (exists) {
            throw new common_1.ConflictException(`A product with slug "${slug}" already exists. Provide a unique slug.`);
        }
        return this.productsRepo.create({ ...dto, slug });
    }
    async update(id, dto) {
        const product = await this.productsRepo.findById(id);
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID "${id}" was not found.`);
        }
        return this.productsRepo.update(id, dto);
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_repository_1.ProductRepository])
], ProductService);
//# sourceMappingURL=product.service.js.map