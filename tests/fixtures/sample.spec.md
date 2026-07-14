# User Authentication Feature Specification

## Overview
Allow registered users to log in to the application using email and password credentials.

## Acceptance Criteria

1. A user with valid credentials can log in and receives a session token.
2. A login attempt with an incorrect password is rejected with an error message.
3. A login attempt with an unregistered email is rejected with an error message.
4. After 5 consecutive failed attempts, the account is locked for 15 minutes.
5. Passwords must be at least 8 characters and contain at least one digit.

## User Stories

**As a** registered user, **I want** to log in with my email and password **so that** I can access my personal dashboard.

**As a** security-conscious user, **I want** my account locked after repeated failures **so that** brute-force attacks are prevented.
