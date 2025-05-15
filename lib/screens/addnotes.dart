import 'dart:developer';
import 'package:cabin_check/models/global_var.dart';
import 'package:cabin_check/screens/loading_model.dart';
import 'package:cabin_check/theme/app_theme.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class NotePage extends ConsumerStatefulWidget {
  const NotePage({Key? key}) : super(key: key);

  @override
  ConsumerState<NotePage> createState() => _NotePageState();
}

class _NotePageState extends ConsumerState<NotePage> {
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _messageController = TextEditingController();
  bool _isLoading = false;
  bool _isSending = false;
  Map<String, String>? currentNote;

  @override
  void initState() {
    super.initState();
    fetchCurrentNote();
  }

  @override
  void dispose() {
    _titleController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  Future<void> fetchCurrentNote() async {
    setState(() => _isLoading = true);

    try {
      final teacherName = ref.read(nameProvider);
      final response = await http.get(Uri.parse(
          'http://192.168.29.125:5000/routes/notifications/$teacherName'));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null && data is Map<String, dynamic>) {
          currentNote = {
            'title': data['title'] ?? '',
            'message': data['message'] ?? '',
          };
        }
      } else if (response.statusCode == 201) {
        currentNote = null;
      } else {
        _showSnackBar('Failed to fetch note', isSuccess: false);
      }
    } catch (e) {
      _showSnackBar('Failed to fetch note', isSuccess: false);
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  void _showSnackBar(String message, {required bool isSuccess}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(
              isSuccess ? Icons.check_circle : Icons.error_outline,
              color: Colors.white,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                message,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                ),
              ),
            ),
          ],
        ),
        backgroundColor:
            isSuccess ? Colors.green.shade600 : Colors.red.shade600,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        duration: const Duration(seconds: 3),
        elevation: 4,
      ),
    );
  }

  Future<void> sendNote() async {
    final title = _titleController.text.trim();
    final message = _messageController.text.trim();
    final username = ref.read(nameProvider);

    if (title.isEmpty || message.isEmpty) {
      _showSnackBar('Title and message cannot be empty', isSuccess: false);
      return;
    }

    setState(() => _isSending = true);

    try {
      final response = await http.post(
        Uri.parse('http://192.168.29.125:5000/routes/notifications/'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'title': title,
          'message': message,
          'teacher': username,
        }),
      );

      if (response.statusCode == 201) {
        Navigator.pop(context); // Close bottom sheet first
        _showSnackBar('Note sent successfully 🎉', isSuccess: true);
        _titleController.clear();
        _messageController.clear();
        await fetchCurrentNote(); // Refresh current note
      } else if (response.statusCode == 409) {
        Navigator.pop(context);
        _showSnackBar('Failed to send note: Note Already Exists',
            isSuccess: false);
      }
    } catch (e) {
      _showSnackBar('Network error occurred. Please try again.',
          isSuccess: false);
    } finally {
      setState(() => _isSending = false);
    }
  }

  Future<void> deleteNote() async {
    try {
      final teacherName = ref.read(nameProvider);
      final response = await http.delete(
        Uri.parse(
            'http://192.168.29.125:5000/routes/notifications/$teacherName'),
      );

      if (response.statusCode == 200) {
        _showSnackBar('Note deleted successfully 🗑️', isSuccess: true);
        setState(() {
          currentNote = null;
          _titleController.clear();
          _messageController.clear();
        });
      } else if (response.statusCode == 404) {
        _showSnackBar('Note Does Not Exist', isSuccess: false);
      }
    } catch (e) {
      _showSnackBar('Error deleting note: Network issue', isSuccess: false);
    }
  }

  void _showAddNoteBottomSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.grey.shade50,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25)),
      ),
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
          left: 24,
          right: 24,
          top: 24,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Handle bar
            Center(
              child: Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 24),
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),

            // Title
            const Text(
              'Add New Note',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 20),

            // Title field
            TextField(
              controller: _titleController,
              maxLength: 50, // Limit title to 50 characters
              decoration: InputDecoration(
                labelText: 'Title',
                labelStyle: TextStyle(color: Colors.grey.shade700),
                filled: true,
                fillColor: Colors.white,
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey.shade300),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.blue.shade400, width: 2),
                ),
                contentPadding: const EdgeInsets.all(16),
              ),
            ),
            const SizedBox(height: 16),

            // Message field
            TextField(
              controller: _messageController,
              maxLines: 5,
              maxLength: 250, // Limit message to 250 characters
              decoration: InputDecoration(
                labelText: 'Message',
                labelStyle: TextStyle(color: Colors.grey.shade700),
                filled: true,
                fillColor: Colors.white,
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey.shade300),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.blue.shade400, width: 2),
                ),
                contentPadding: const EdgeInsets.all(16),
              ),
            ),
            const SizedBox(height: 24),

            // Send button
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: _isSending ? null : sendNote,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.black,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 2,
                ),
                child: _isSending
                    ? const SizedBox(
                        height: 24,
                        width: 24,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    : const Text(
                        'Send Note',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        backgroundColor: Colors.grey.shade50,
        elevation: 0,
        title: const Text(
          'Notes',
          style: TextStyle(
            color: Colors.black,
            fontSize: 26,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Current Note Card
                  currentNote != null
                      ? Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.grey.shade200,
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Header row
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text(
                                    'Current Note',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                      color: Colors.black45,
                                      letterSpacing: 0.5,
                                    ),
                                  ),
                                  IconButton(
                                    icon: Icon(
                                      Icons.delete_outline,
                                      color: Colors.red.shade400,
                                      size: 20,
                                    ),
                                    onPressed: deleteNote,
                                    tooltip: 'Delete note',
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),

                              // Title
                              Text(
                                currentNote!['title']!,
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.black,
                                ),
                              ),
                              const SizedBox(height: 8),

                              // Message
                              Text(
                                currentNote!['message']!,
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey.shade800,
                                  height: 1.4,
                                ),
                              ),
                            ],
                          ),
                        )
                      : Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.note_alt_outlined,
                                size: 60,
                                color: Colors.grey.shade400,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                "No notes yet",
                                style: TextStyle(
                                  color: Colors.grey.shade600,
                                  fontSize: 18,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                "Create a new note by tapping the button below",
                                style: TextStyle(
                                  color: Colors.grey.shade500,
                                  fontSize: 14,
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ],
                          ),
                        ),

                  // Add Note Button
                  const SizedBox(height: 24),
                  SizedBox(
                    height: 54,
                    child: ElevatedButton.icon(
                      onPressed: _showAddNoteBottomSheet,
                      icon: const Icon(Icons.add),
                      label: const Text('Add New Note'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.black,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                        elevation: 2,
                        textStyle: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
