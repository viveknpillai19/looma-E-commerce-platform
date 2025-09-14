graph TD
  subgraph "Scene 1: New User Registration"
    A1[User via curl / client] -->|HTTP POST /api/v1/auth/register with User DTO| B1[AuthController]
    B1 -->|Calls registerUser()| C1[AuthService]
    C1 -->|Checks if email exists| D1[UserRepository]
    D1 -->|findByEmail()| E1[(PostgreSQL DB)]
    E1 -->|Returns 'user not found'| D1
    D1 --> C1
    C1 -->|Hashes password| F1{PasswordEncoder}
    C1 -->|Creates User entity & calls save()| G1[UserRepository]
    G1 -->|INSERT new user record| E1
    C1 -->|Returns success| B1
    B1 -->|Sends HTTP 201 Created| A1
  end

  subgraph "Scene 2: Existing User Login"
    A2[User via curl / client] -->|HTTP POST /api/v1/auth/login with Login DTO| B2[AuthController]
    B2 -->|Calls authenticate()| H2{AuthenticationManager}
    H2 -->|Calls loadUserByUsername()| I2[CustomUserDetailsService]
    I2 -->|Calls findByEmail()| J2[UserRepository]
    J2 -->|SELECT user by email| K2[(PostgreSQL DB)]
    K2 -->|Returns User record| J2
    J2 -->|Returns UserDetails object| I2
    I2 --> H2
    H2 -->|Compares passwords using| F2{PasswordEncoder}
    F2 -->|Passwords match ✅| H2
    H2 -->|Returns successful Authentication object| B2
    B2 -->|Creates placeholder JWT| A2
  end

  style E1 fill:#d6e4f0,stroke:#333,stroke-width:2px
  style K2 fill:#d6e4f0,stroke:#333,stroke-width:2px
  style F1 fill:#f9fbe7,stroke:#333,stroke-width:2px
  style F2 fill:#f9fbe7,stroke:#333,stroke-width:2px
  style H2 fill:#e1f5fe,stroke:#333,stroke-width:2px
