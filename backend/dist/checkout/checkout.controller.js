"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutController = void 0;
const common = __importStar(require("@nestjs/common"));
const swagger_1 = require("@nestjs/swagger");
const checkout_service_1 = require("./checkout.service");
const checkout_dto_1 = require("./dto/checkout.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth-guard");
let CheckoutController = class CheckoutController {
    checkoutService;
    constructor(checkoutService) {
        this.checkoutService = checkoutService;
    }
    async createIntent(dto, req) {
        const userId = req.user.id;
        return this.checkoutService.createPaymentIntent(userId, dto);
    }
    async webhook(req, signature) {
        return this.checkoutService.handleWebhook(req.rawBody, signature);
    }
};
exports.CheckoutController = CheckoutController;
__decorate([
    common.Post('intent'),
    common.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common.HttpCode(common.HttpStatus.CREATED),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create Stripe PaymentIntent',
        description: 'Server-side total is always recalculated — never trust the frontend total. ' +
            'Validates stock, applies discount code if provided, then creates a ' +
            'Stripe PaymentIntent. Returns the client_secret for use with Stripe Elements. ' +
            'Requires authentication.',
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Returns clientSecret, subtotal, discount, and total (all in cents)',
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Empty cart, invalid address, or invalid discount code',
    }),
    __param(0, common.Body()),
    __param(1, common.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [checkout_dto_1.CreatePaymentIntentDto, Object]),
    __metadata("design:returntype", Promise)
], CheckoutController.prototype, "createIntent", null);
__decorate([
    common.Post('webhook'),
    common.HttpCode(common.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Stripe webhook receiver',
        description: 'Receives events from Stripe. Verifies the webhook signature using ' +
            'STRIPE_WEBHOOK_SECRET. On payment_intent.succeeded, atomically creates ' +
            'the order. This endpoint must receive the raw request body — do not ' +
            'apply JSON body-parser middleware to this route.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: '{ received: true }' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid Stripe signature' }),
    __param(0, common.Req()),
    __param(1, common.Headers('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CheckoutController.prototype, "webhook", null);
exports.CheckoutController = CheckoutController = __decorate([
    (0, swagger_1.ApiTags)('checkout'),
    common.Controller('checkout'),
    __metadata("design:paramtypes", [checkout_service_1.CheckoutService])
], CheckoutController);
//# sourceMappingURL=checkout.controller.js.map