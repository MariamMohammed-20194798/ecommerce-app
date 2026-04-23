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
exports.ReviewsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth-guard");
const review_dto_1 = require("./dto/review.dto");
const reviews_service_1 = require("./reviews.service");
let ReviewsController = class ReviewsController {
    reviewsService;
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    getAuthUser(req) {
        const requestWithUser = req;
        return requestWithUser.user;
    }
    getAuthUserId(req) {
        const user = this.getAuthUser(req);
        const userId = user?.sub ?? user?.id;
        if (!userId) {
            throw new common_1.UnauthorizedException('Missing authenticated user id.');
        }
        return userId;
    }
    async findMyReviews(req) {
        const userId = this.getAuthUserId(req);
        return this.reviewsService.findMyReviews(userId);
    }
    async create(dto, req) {
        const userId = this.getAuthUserId(req);
        return this.reviewsService.create(userId, dto);
    }
    async update(id, dto, req) {
        const userId = this.getAuthUserId(req);
        return this.reviewsService.update(id, userId, dto);
    }
    async remove(id, req) {
        const user = this.getAuthUser(req);
        const userId = this.getAuthUserId(req);
        return this.reviewsService.remove(id, userId, user?.role);
    }
};
exports.ReviewsController = ReviewsController;
__decorate([
    (0, common_1.Get)('my'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: "Current user's reviews",
        description: 'Returns all reviews written by the authenticated user with product info.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Array of reviews for the current user' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "findMyReviews", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a review',
        description: 'Creates a review for a purchased product (shipped/delivered only). One review per user per product.',
    }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Review created' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Product not found' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Product not purchased yet' }),
    (0, swagger_1.ApiConflictResponse)({ description: 'User already reviewed this product' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [review_dto_1.CreateReviewDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Update own review',
        description: 'Users can update only their own review. Supports partial update of rating/body.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Review updated' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Review not found' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Cannot update another user review' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, review_dto_1.UpdateReviewDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a review',
        description: 'Users can delete their own reviews. Admin users can delete any review.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Review deleted' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Review not found' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Cannot delete another user review' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "remove", null);
exports.ReviewsController = ReviewsController = __decorate([
    (0, swagger_1.ApiTags)('reviews'),
    (0, common_1.Controller)('reviews'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService])
], ReviewsController);
//# sourceMappingURL=reviews.controller.js.map