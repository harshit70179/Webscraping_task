exports.table = [
  {
    tableName: "task",
    query:
      "CREATE TABLE IF NOT EXISTS task(id INT AUTO_INCREMENT PRIMARY KEY,email TEXT NULL,name VARCHAR(255) NULL,mobile_number TEXT NULL,logo VARCHAR(255) NULL,description TEXT NULL,address TEXT NULL,screen_shot VARCHAR(255) NULL,facebook_url VARCHAR(255) NULL,twitter_url VARCHAR(255) NULL,linkedin_url VARCHAR(255) NULL,instagram_url VARCHAR(255) NULL,website VARCHAR(255) NULL,createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP)",
  },
 
];
