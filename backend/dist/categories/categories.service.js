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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const category_repository_1 = require("./category.repository");
let CategoriesService = class CategoriesService {
    categoryRepo;
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
    async findAll(query) {
        return this.categoryRepo.findAll(query);
    }
    async findTree() {
        return this.categoryRepo.findTree();
    }
    async findBySlug(slug) {
        const category = await this.categoryRepo.findBySlug(slug);
        if (!category) {
            throw new common_1.NotFoundException(`Category with slug "${slug}" was not found.`);
        }
        return category;
    }
    async findProducts(slug, query) {
        const result = await this.categoryRepo.findProductsBySlug(slug, query);
        if (!result) {
            throw new common_1.NotFoundException(`Category with slug "${slug}" was not found.`);
        }
        return result;
    }
    async create(dto) {
        const slug = dto.slug ?? this.generateSlug(dto.name);
        const slugTaken = await this.categoryRepo.slugExists(slug);
        if (slugTaken) {
            throw new common_1.ConflictException(`A category with slug "${slug}" already exists. ` +
                `Provide a unique slug or use a different name.`);
        }
        if (dto.parentId) {
            const parent = await this.categoryRepo.findById(dto.parentId);
            if (!parent) {
                throw new common_1.NotFoundException(`Parent category with ID "${dto.parentId}" was not found.`);
            }
        }
        return this.categoryRepo.create({ ...dto, slug });
    }
    async update(id, dto) {
        const existing = await this.categoryRepo.findById(id);
        if (!existing) {
            throw new common_1.NotFoundException(`Category with ID "${id}" was not found.`);
        }
        const newSlug = dto.slug ?? (dto.name ? this.generateSlug(dto.name) : undefined);
        if (newSlug && newSlug !== existing.slug) {
            const slugTaken = await this.categoryRepo.slugExists(newSlug, id);
            if (slugTaken) {
                throw new common_1.ConflictException(`A category with slug "${newSlug}" already exists.`);
            }
        }
        if (dto.parentId) {
            if (dto.parentId === id) {
                throw new common_1.BadRequestException('A category cannot be its own parent.');
            }
            const parent = await this.categoryRepo.findById(dto.parentId);
            if (!parent) {
                throw new common_1.NotFoundException(`Parent category with ID "${dto.parentId}" was not found.`);
            }
        }
        return this.categoryRepo.update(id, {
            ...dto,
            ...(newSlug ? { slug: newSlug } : {}),
        });
    }
    async delete(id) {
        const existing = await this.categoryRepo.findById(id);
        if (!existing) {
            throw new common_1.NotFoundException(`Category with ID "${id}" was not found.`);
        }
        const hasProducts = await this.categoryRepo.hasProducts(id);
        if (hasProducts) {
            throw new common_1.UnprocessableEntityException('Cannot delete a category that has products assigned to it. ' +
                'Reassign or delete the products first.');
        }
        const hasChildren = await this.categoryRepo.hasChildren(id);
        if (hasChildren) {
            throw new common_1.UnprocessableEntityException('Cannot delete a category that has subcategories. ' +
                'Delete or re-parent the subcategories first.');
        }
        await this.categoryRepo.delete(id);
        return {
            message: `Category "${existing.name}" was deleted successfully.`,
        };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [category_repository_1.CategoryRepository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map