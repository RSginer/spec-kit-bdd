# User Authentication — spec-kit Specification

## Overview
Allow registered users to log into the application with email and password.

## Acceptance Criteria

1. A user with valid credentials receives a session token and is redirected to the dashboard.
2. A login attempt with an incorrect password is rejected with the message "Invalid credentials".
3. A login attempt with an unregistered email is rejected with the message "Invalid credentials".
4. After 5 consecutive failed login attempts, the account is locked for 15 minutes.
5. Email must match RFC 5321 format; invalid formats are rejected with "Invalid email format".
6. Passwords must be at least 8 characters and contain at least one digit.

## User Stories

**As a** registered user, **I want** to log in with my email and password **so that** I can access my personal dashboard.

**As a** security-conscious user, **I want** my account locked after repeated failures **so that** brute-force attacks are prevented.
