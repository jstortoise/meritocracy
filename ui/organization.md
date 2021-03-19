# Instruction

## Signup

### Signup to Meritocracy system

A visitor can signup to Meritocracy system to become Meritocracy user via https://ui.keycloak.dev.galaxias.io/signup

### Signup to Organization websie with Meritocracy system

By clicking `Signup with Meritocracy system`, a visitor can signup to Organization website with Meritocracy system via https://ui.keycloak.dev.galaxias.io/signup?redirect_uri=organization_domain_name&action=signup&appkey=0c16b40e-78a1-4b4c-8b39-71a9fb976875

After Signup via Meritocracy system, the visito will be come a Meritocracy user (if he is not already) and Organisation user.

## Login

### Login to Meritocracy system

Once you signed up to Meritocracy system, you can login to Meritocracy system via https://ui.keycloak.dev.galaxias.io/login

### Login to Organization website with Meritocracy system

Once you signed up to Meritocracy system, you can login to your Organization website with Meritocracy system via https://ui.keycloak.dev.galaxias.io/login?redirect_uri=organization_domain_name&appkey=0c16b40e-78a1-4b4c-8b39-71a9fb976875

## User roles

There're 3 types of actors on Meritocracy system.

### 1. Administrator
The system admin can add/update/delete system admin and assign them roles such as
- Create/update/delete system admin created by this system admin. The root admin can edit/update/delete all the admins in the system 
- List system organisation and their meta data/stats
- List system users and members

### 2. User
User can can see all the Organisations available on Meritocracy system .
He can add/Edit/delete his own organisation and publish it to Meritocracy system.

### 3. Member
Member is a Meritocracy users with additional rights such as:
- Have access to Meritocracy area where he can check Organisations stats
- Switch between organisation in Member area

## Organization

Meritocracy can support multiple organisations website.
Each Organisation website will have his own domain name.
Building organisation website procedure using React will be provided as an example to build Organisations websites but other technologies (React, angular, ..) can be used as well.
