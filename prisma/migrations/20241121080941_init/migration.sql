-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `imageUrl` VARCHAR(191) NULL,
    `imageId` VARCHAR(191) NULL,
    `password` VARCHAR(120) NOT NULL,
    `addedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Hotel` (
    `id` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `title` VARCHAR(120) NOT NULL,
    `description` VARCHAR(500) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `imageId` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `locationDescription` VARCHAR(500) NOT NULL,
    `gym` BOOLEAN NOT NULL,
    `spa` BOOLEAN NOT NULL,
    `laundry` BOOLEAN NOT NULL,
    `restaurant` BOOLEAN NOT NULL,
    `shopping` BOOLEAN NOT NULL,
    `freeParking` BOOLEAN NOT NULL,
    `bikeRental` BOOLEAN NOT NULL,
    `movieNights` BOOLEAN NOT NULL,
    `swimmingPool` BOOLEAN NOT NULL,
    `coffeeShop` BOOLEAN NOT NULL,
    `addedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    FULLTEXT INDEX `Hotel_title_idx`(`title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(120) NOT NULL,
    `description` VARCHAR(500) NOT NULL,
    `bedCount` INTEGER NOT NULL DEFAULT 0,
    `guestCount` INTEGER NULL DEFAULT 0,
    `bathroomCount` INTEGER NOT NULL DEFAULT 0,
    `kingBed` INTEGER NULL DEFAULT 0,
    `queenBed` INTEGER NULL DEFAULT 0,
    `imageId` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `breakFastPrice` INTEGER NOT NULL,
    `roomPrice` INTEGER NOT NULL,
    `roomservice` BOOLEAN NOT NULL DEFAULT false,
    `tv` BOOLEAN NOT NULL DEFAULT false,
    `balcony` BOOLEAN NOT NULL DEFAULT false,
    `freeWifi` BOOLEAN NOT NULL DEFAULT false,
    `cityView` BOOLEAN NOT NULL DEFAULT false,
    `mountainView` BOOLEAN NOT NULL DEFAULT false,
    `airCondition` BOOLEAN NOT NULL DEFAULT false,
    `soundProofed` BOOLEAN NOT NULL DEFAULT false,
    `userId` INTEGER NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,

    INDEX `Room_hotelId_idx`(`hotelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Booking` (
    `id` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `roomId` VARCHAR(191) NOT NULL,
    `hotelId` VARCHAR(191) NOT NULL,
    `hotelOwnerId` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `breakfastIncluded` BOOLEAN NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `totalPrice` INTEGER NOT NULL,
    `paymentStatus` BOOLEAN NOT NULL DEFAULT false,
    `paymentIntentId` VARCHAR(191) NOT NULL,
    `bookedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Booking_paymentIntentId_key`(`paymentIntentId`),
    INDEX `Booking_hotelId_idx`(`hotelId`),
    INDEX `Booking_roomId_idx`(`roomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Hotel` ADD CONSTRAINT `Hotel_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_hotelId_fkey` FOREIGN KEY (`hotelId`) REFERENCES `Hotel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
