# basic-postgresql-sample

This project is created and to be executed thru `yuniql` CLI tool.

- To install `yuniql cli`, see https://yuniql.io/docs/install-yuniql
- To format connection string, see https://www.connectionstrings.com.

How to run Yuniql locally: https://yuniql.io/docs/get-started-postgresql/

How to Add DDL AND DML sctipts 

 Create a folder structure that will hold different versions of your scripts, such as v0.00, v0.01, etc.

 /Scripts
    /v0.00
    /v0.01
    /v0.02

Name the folders to represent different versions of your scripts. These could be incremental like v0.00, v0.01, v0.02, etc.

Create DDL or DML Scripts in Version Folders
Inside each version folder, create SQL script files for either DDL or DML operations.

For example, inside the v0.00 folder, create a file called Create_table.sql.
DDL Example (Creating a Table):

-- This script creates a table named <tablename> in the default schema (public if no schema is specified)

CREATE TABLE <tablename> (
    PersonID int,
    LastName varchar(255),
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255)
);

-- If you want to create a table in a specific schema, 
-- prepend the schema name before the table name:

CREATE TABLE <schemaname>.<tablename> (
    PersonID int,
    LastName varchar(255),
    FirstName varchar(255),
    Address varchar(255),
    City varchar(255)
);

-- If no schema is specified, the table will be created in the default schema (public in PostgreSQL).


DB Deployment - Details

This GitHub Actions workflow automates the process of deploying database schema changes to an Amazon RDS PostgreSQL instance. Here's a high-level overview of what happens:

1. Triggering the Workflow:
The workflow is manually triggered through GitHub Actions, where the user specifies the environment (dev, qa, prd, etc.), the AWS region, and the RDS instance name (e.g., shared).

2. Setting Up AWS Credentials:
It configures AWS credentials dynamically based on the provided environment and region. The workflow assumes a specific  role using the AWS Security Token Service (STS) and sets up the necessary access to AWS resources.

3. Fetching Secrets:
The workflow retrieves sensitive information (like database credentials) from AWS Secrets Manager. These credentials are needed for connecting to the PostgreSQL database.

4. Fetching App Configuration:
The workflow retrieves additional configuration settings (such as the database host, port, and name) from AWS AppConfig, which stores environment-specific configuration values.

5. Installing Yuniql (if not already installed):
It checks if Yuniql, the database migration tool, is installed on the runner. If it's not, the workflow downloads and installs it.

6. Running Database Migrations with Yuniql:
The core of the workflow: Yuniql is initialized and used to run database migration scripts. These scripts (stored in a directory, like ./scripts) are applied to the target PostgreSQL database.
The connection details (host, port, username, password, etc.) are provided to Yuniql, ensuring it can connect to the correct RDS instance and apply the migrations.

Commands for reference to run locally
s
SETX YUNIQL_PLATFORM "postgresql"
SETX YUNIQL_WORKSPACE "C:\Workspaces\Demo\PostgreSQLMigration\PostgreSQLMigration\basic-postgresql-sample"
SETX YUNIQL_CONNECTION_STRING "Database=XXX-datastore; Server=kf-XXXXXXXXXXXX-XXXXX-X.postgres.database.azure.com; User Id=kf_ic2_XXXXX@kf-intelligence-cloud-2; Password=XXXXXXXXX@XXXXXXXXXXXX-XXXXX-X; Ssl Mode=Require;"

yuniql list --platform postgresql
yuniql run --platform postgresql -a --debug --target-version v0.04



Guidelines for Changing Role and Database Connection Details
1. Modifying IAM Role for Database Access
In the GitHub Actions workflow, the IAM role that allows access to AWS resources like RDS and Secrets Manager is assumed using a dynamic value. Here’s how to modify or change it as needed:
Steps to Modify the IAM Role:
1.	Understand the Role Format:
  • The role to assume is dynamically selected based on the environment (dev, prd, etc.) and region (us-east-1, eu-west-1, etc.).
  •	The role name is stored in the secrets section of the repository, so changes to the role might require adjustments there.
      2. Modifying the Role Name:
•	In the workflow, the role to be assumed is configured in the following step:
- name: Configure AWS Credentials
•	 The role-to-assume key dynamically selects the IAM role based on the environment and region. To update the role:
•	Modify the secret key structure in the GitHub repository (secrets management).
•	Ensure that the correct IAM role exists in AWS with the necessary permissions.
  3.  Permissions for the IAM Role:
•	Ensure that the role has the necessary permissions to access AWS Secrets Manager, AppConfig, and RDS (for querying database credentials).
•	For database access, the IAM role should have permissions like rds:DescribeDBInstances, secretsmanager:GetSecretValue, and other relevant permissions for PostgreSQL.

2. Modifying Database Connection Details
The connection details (host, port, database name, etc.) for PostgreSQL are retrieved from AWS AppConfig, and database credentials (such as username and password) are stored in AWS Secrets Manager.
Steps to Modify Database Connection Details:
1.	Modify the AppConfig Configuration:
•	Database connection details like the host, port, and database name are fetched from AWS AppConfig.
•	To modify the database connection:
•	Go to AWS AppConfig.
•	Select the application corresponding to your environment (e.g., kfone-${environment}-appconfig-app-001-common).
•	Under Configurations, select the PgSQL-${rds_instanceName} configuration profile.
•	Update the configuration values such as host, port, and database according to the new settings for your PostgreSQL database.
2.	Modify Secrets for Database Credentials:
•	The database credentials (username and password) are retrieved from AWS Secrets Manager.
•	To update the credentials:
•	Go to AWS Secrets Manager.
•	Find the secret that contains the PostgreSQL credentials, which could be something like /system/platform/postgres/shared/iam-pwd.
•	Modify the secret values (e.g., update the username or password).
•	Make sure the secret is in the correct format for consumption by the application.
3.	Update the Database Connection String:
•	The database connection string is generated dynamically in the workflow using the AppConfig and Secrets Manager values:

 we aree reading the app config from this step
 name: Start AppConfig Configuration Session
•	The HOST, PORT, DATABASE, USERNAME, and PASSWORD values come from the AppConfig and Secrets Manager.
•	If any of these details change (e.g., new DB username/password or database host), ensure the respective values in the workflow are updated accordingly.

