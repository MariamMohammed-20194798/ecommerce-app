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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const review_repository_1 = require("./review.repository");
let ReviewsService = class ReviewsService {
    reviewsRepo;
    constructor(reviewsRepo) {
        this.reviewsRepo = reviewsRepo;
    }
    async findMyReviews(userId) {
        return this.reviewsRepo.findMyReviews(userId);
    }
    async create(userId, dto) {
        const product = await this.reviewsRepo.productExists(dto.productId);
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID "${dto.productId}" was not found.`);
        }
        const hasPurchased = await this.reviewsRepo.hasPurchasedProduct(userId, dto.productId);
        if (!hasPurchased) {
            throw new common_1.BadRequestException('You can only review products from shipped or delivered orders.');
        }
        const existing = await this.reviewsRepo.findUserReviewForProduct(userId, dto.productId);
        if (existing) {
            throw new common_1.ConflictException('You have already reviewed this product. You can edit your existing review.');
        }
        return this.reviewsRepo.create({
            userId,
            productId: dto.productId,
            rating: dto.rating,
            body: dto.body,
        });
    }
    async update(id, userId, dto) {
        const review = await this.reviewsRepo.findById(id);
        if (!review) {
            throw new common_1.NotFoundException(`Review "${id}" was not found.`);
        }
        if (review.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own reviews.');
        }
        return this.reviewsRepo.update(id, {
            ...(dto.rating !== undefined ? { rating: dto.rating } : {}),
            ...(dto.body !== undefined ? { body: dto.body } : {}),
        });
    }
    async remove(id, userId, role) {
        const review = await this.reviewsRepo.findById(id);
        if (!review) {
            throw new common_1.NotFoundException(`Review "${id}" was not found.`);
        }
        const isAdmin = role === 'ADMIN';
        const isOwner = review.userId === userId;
        if (!isAdmin && !isOwner) {
            throw new common_1.ForbiddenException('You can only delete your own review unless you are an admin.');
        }
        await this.reviewsRepo.remove(id);
        return { message: `Review "${id}" deleted successfully.` };
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [review_repository_1.ReviewRepository])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map