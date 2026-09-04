CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`survivor_id` text NOT NULL,
	`day` integer NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`lesson` text DEFAULT '' NOT NULL,
	`next_objective` text DEFAULT '' NOT NULL,
	`outcome` text DEFAULT 'alive' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`survivor_id`) REFERENCES `survivors`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_sessions_survivor_created` ON `sessions` (`survivor_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `survivors` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`status` text DEFAULT 'alive' NOT NULL,
	`build` text DEFAULT '42' NOT NULL,
	`town` text NOT NULL,
	`occupation` text NOT NULL,
	`traits` text DEFAULT '' NOT NULL,
	`game_mode` text DEFAULT 'Survivor' NOT NULL,
	`day` integer DEFAULT 1 NOT NULL,
	`hours` integer DEFAULT 0 NOT NULL,
	`kills` integer DEFAULT 0 NOT NULL,
	`condition` text DEFAULT 'Healthy' NOT NULL,
	`base` text DEFAULT 'None yet' NOT NULL,
	`vehicle` text DEFAULT 'None' NOT NULL,
	`weapon` text DEFAULT 'Unarmed' NOT NULL,
	`supplies` text DEFAULT 'Unknown' NOT NULL,
	`current_objective` text DEFAULT 'Find shelter and basic supplies' NOT NULL,
	`run_goal` text DEFAULT '' NOT NULL,
	`cause_of_death` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`ended_at` text
);
--> statement-breakpoint
CREATE INDEX `idx_survivors_status_updated` ON `survivors` (`status`,`updated_at`);