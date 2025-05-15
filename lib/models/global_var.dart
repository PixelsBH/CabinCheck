import 'package:flutter_riverpod/flutter_riverpod.dart';

String id = "";
String Username = "";
String email = "";
String firebaseUID = "";
String status = "";
String imageUrl = "";
StateProvider<String> imageProvider = StateProvider((ref) => "");
StateProvider<String> emailProvider = StateProvider((ref) => "");
StateProvider<String> nameProvider = StateProvider((ref) => "");
StateProvider<String> statusProvider = StateProvider((ref) => "");
const String logopath = "assets/CabinCheck.png";
const String google = "assets/google.png";
