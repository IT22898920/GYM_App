/// User Model
class User {
  final String id;
  final String firstName;
  final String lastName;
  final String email;
  final String? phoneNumber;
  final String role; // 'admin', 'gym_owner', 'instructor', 'customer'
  final String? profileImage;
  final bool isActive;
  final String? gymId; // For gym owners
  final DateTime createdAt;

  User({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    this.phoneNumber,
    required this.role,
    this.profileImage,
    required this.isActive,
    this.gymId,
    required this.createdAt,
  });

  // Full name getter
  String get fullName => '$firstName $lastName';

  // Check if user is admin
  bool get isAdmin => role == 'admin';

  // Check if user is gym owner
  bool get isGymOwner => role == 'gym_owner';

  // Check if user is instructor
  bool get isInstructor => role == 'instructor';

  // Check if user is customer
  bool get isCustomer => role == 'customer';

  // Create User from JSON
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'] ?? json['id'] ?? '',
      firstName: json['firstName'] ?? '',
      lastName: json['lastName'] ?? '',
      email: json['email'] ?? '',
      phoneNumber: json['phoneNumber'],
      role: json['role'] ?? 'customer',
      profileImage: json['profileImage'],
      isActive: json['isActive'] ?? true,
      gymId: json['gym']?['_id'] ?? json['gym'],
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
    );
  }

  // Convert User to JSON
  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'phoneNumber': phoneNumber,
      'role': role,
      'profileImage': profileImage,
      'isActive': isActive,
      'gym': gymId,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  // Create a copy of User with updated fields
  User copyWith({
    String? id,
    String? firstName,
    String? lastName,
    String? email,
    String? phoneNumber,
    String? role,
    String? profileImage,
    bool? isActive,
    String? gymId,
    DateTime? createdAt,
  }) {
    return User(
      id: id ?? this.id,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      email: email ?? this.email,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      role: role ?? this.role,
      profileImage: profileImage ?? this.profileImage,
      isActive: isActive ?? this.isActive,
      gymId: gymId ?? this.gymId,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  String toString() {
    return 'User(id: $id, name: $fullName, email: $email, role: $role)';
  }
}
