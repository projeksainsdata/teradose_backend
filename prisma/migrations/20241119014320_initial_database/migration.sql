-- CreateTable
CREATE TABLE `logs` (
    `id` VARCHAR(191) NOT NULL,
    `level` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `method` VARCHAR(191) NOT NULL,
    `requestId` VARCHAR(191) NULL,
    `user` VARCHAR(191) NULL,
    `role` VARCHAR(191) NULL,
    `apiKey` VARCHAR(191) NULL,
    `anonymous` BOOLEAN NOT NULL DEFAULT true,
    `accessFor` VARCHAR(191) NULL,
    `description` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NULL,
    `tags` VARCHAR(191) NOT NULL,
    `params` VARCHAR(191) NOT NULL DEFAULT '{}',
    `bodies` VARCHAR(191) NOT NULL DEFAULT '{}',
    `statusCode` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `logs_action_idx`(`action`),
    INDEX `logs_level_idx`(`level`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settings` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `type` ENUM('BOOLEAN', 'STRING', 'ARRAY_OF_STRING', 'NUMBER') NULL,
    `value` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `settings_name_key`(`name`),
    INDEX `settings_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `accessFor` ENUM('SUPER_ADMIN', 'USER', 'AUTHOR') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    INDEX `roles_isActive_name_idx`(`isActive`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(25) NOT NULL,
    `group` ENUM('USER', 'ROLE', 'PERMISSION', 'SETTING') NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `permissions_code_key`(`code`),
    INDEX `permissions_code_idx`(`code`),
    INDEX `permissions_group_idx`(`group`),
    INDEX `permissions_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_permissions` (
    `roleId` VARCHAR(191) NOT NULL,
    `permissionId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`roleId`, `permissionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `jobTitle` VARCHAR(191) NOT NULL,
    `role` VARCHAR(100) NOT NULL DEFAULT 'USER',
    `password` VARCHAR(255) NOT NULL,
    `passwordExpired` DATETIME(3) NOT NULL,
    `passwordCreated` DATETIME(3) NOT NULL,
    `passwordAttempt` INTEGER NOT NULL DEFAULT 0,
    `signUpDate` DATETIME(3) NULL,
    `salt` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `inactivePermanent` BOOLEAN NOT NULL DEFAULT false,
    `inactiveDate` DATETIME(3) NULL,
    `blocked` BOOLEAN NOT NULL DEFAULT false,
    `blockedDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_fullName_idx`(`fullName`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_role_idx`(`role`),
    INDEX `users_isActive_idx`(`isActive`),
    INDEX `users_inactivePermanent_idx`(`inactivePermanent`),
    INDEX `users_blocked_idx`(`blocked`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `type` ENUM('REPOSITORIES', 'BLOGS') NOT NULL,

    UNIQUE INDEX `categories_name_key`(`name`),
    UNIQUE INDEX `categories_slug_key`(`slug`),
    INDEX `categories_name_slug_type_idx`(`name`, `slug`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blogs` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `thumbnail` VARCHAR(255) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `blogs_title_key`(`title`),
    UNIQUE INDEX `blogs_slug_key`(`slug`),
    INDEX `blogs_title_idx`(`title`),
    INDEX `blogs_slug_idx`(`slug`),
    INDEX `blogs_category_idx`(`category`),
    INDEX `blogs_status_idx`(`status`),
    INDEX `blogs_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `repositories` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `thumbnail` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `indication` VARCHAR(255) NULL,
    `composition` VARCHAR(255) NULL,
    `dose` VARCHAR(255) NULL,
    `usage_guideline` VARCHAR(255) NULL,
    `attention` VARCHAR(255) NULL,
    `contraindication` VARCHAR(255) NULL,
    `side_effect` VARCHAR(255) NULL,
    `product_categories` VARCHAR(255) NULL,
    `no_registration` VARCHAR(255) NULL,
    `category` VARCHAR(100) NOT NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `repositories_title_key`(`title`),
    UNIQUE INDEX `repositories_slug_key`(`slug`),
    INDEX `repositories_title_idx`(`title`),
    INDEX `repositories_slug_idx`(`slug`),
    INDEX `repositories_category_idx`(`category`),
    INDEX `repositories_status_idx`(`status`),
    INDEX `repositories_product_categories_idx`(`product_categories`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permissionId_fkey` FOREIGN KEY (`permissionId`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_fkey` FOREIGN KEY (`role`) REFERENCES `roles`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blogs` ADD CONSTRAINT `blogs_category_fkey` FOREIGN KEY (`category`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blogs` ADD CONSTRAINT `blogs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `repositories` ADD CONSTRAINT `repositories_category_fkey` FOREIGN KEY (`category`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
