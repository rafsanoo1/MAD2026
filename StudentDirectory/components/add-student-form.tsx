// components/add-student-form.tsx

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import FormField from "./form-field";

interface Student {
  id: string;
  name: string;
  studentId: string;
  department: string;
  email?: string;
  bio: string;
  skills: string[];
  avatarUrl: string;
}

interface AddStudentFormProps {
  onSubmitSuccess: (student: Student) => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  studentId: string;
  email: string;
  department: string;
  bio: string;
  skillsText: string;
}

interface FormErrors {
  name?: string;
  studentId?: string;
  email?: string;
  department?: string;
  bio?: string;
}

function validateForm(data: FormData): FormErrors {
  const newErrors: FormErrors = {};

  if (data.name.trim().length === 0) {
    newErrors.name = "Name is required.";
  } else if (data.name.trim().length < 3) {
    newErrors.name = "Name must be at least 3 characters.";
  }

  const idPattern = /^\d{2}-\d{5}-\d$/;

  if (data.studentId.trim().length === 0) {
    newErrors.studentId = "Student ID is required.";
  } else if (!idPattern.test(data.studentId.trim())) {
    newErrors.studentId = "Format must be NN-NNNNN-N. Example: 22-12345-1.";
  }

  const emailPattern = /^\S+@\S+\.\S+$/;

  if (data.email.trim().length === 0) {
    newErrors.email = "Email is required.";
  } else if (!emailPattern.test(data.email.trim())) {
    newErrors.email = "Enter a valid email address.";
  }

  if (data.department.trim().length === 0) {
    newErrors.department = "Department is required.";
  }

  if (data.bio.trim().length === 0) {
    newErrors.bio = "Bio is required.";
  } else if (data.bio.trim().length < 10) {
    newErrors.bio = "Bio must be at least 10 characters.";
  } else if (data.bio.length > 200) {
    newErrors.bio = "Bio must not exceed 200 characters.";
  }

  return newErrors;
}

export default function AddStudentForm({
  onSubmitSuccess,
  onCancel,
}: AddStudentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    studentId: "",
    email: "",
    department: "",
    bio: "",
    skillsText: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitTrigger, setSubmitTrigger] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const markTouched = (field: keyof FormData) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const getFieldError = (field: keyof FormErrors) => {
    return touched[field] || submitAttempted ? errors[field] : undefined;
  };

  useEffect(() => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
  }, [formData]);

  const isRequiredFilled =
    formData.name.trim().length > 0 &&
    formData.studentId.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.department.trim().length > 0 &&
    formData.bio.trim().length > 0;

  const isFormValid = Object.keys(errors).length === 0 && isRequiredFilled;

  const handleSubmitPress = () => {
    setTouched({
      name: true,
      studentId: true,
      email: true,
      department: true,
      bio: true,
      skillsText: true,
    });

    setSubmitAttempted(true);

    const currentErrors = validateForm(formData);
    setErrors(currentErrors);

    const readyToSubmit =
      Object.keys(currentErrors).length === 0 && isRequiredFilled;

    if (readyToSubmit) {
      setIsSubmitting(true);
      setSubmitTrigger(true);
    }
  };

  const handleCancelPress = () => {
    const hasTypedSomething = Object.values(formData).some(
      (value) => value.trim().length > 0
    );

    if (!hasTypedSomething) {
      onCancel();
      return;
    }

    Alert.alert(
      "Discard form?",
      "You have typed some information. Are you sure you want to cancel?",
      [
        {
          text: "Keep Editing",
          style: "cancel",
        },
        {
          text: "Discard",
          style: "destructive",
          onPress: onCancel,
        },
      ]
    );
  };

  useEffect(() => {
    if (!submitTrigger) return;

    const timeoutId = setTimeout(() => {
      const now = Date.now();

      const newStudent: Student = {
        id: now.toString(),
        name: formData.name.trim(),
        studentId: formData.studentId.trim(),
        email: formData.email.trim(),
        department: formData.department.trim(),
        bio: formData.bio.trim(),
        skills: formData.skillsText
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0),
        avatarUrl: "https://i.pravatar.cc/150?u=" + now,
      };

      setIsSubmitting(false);
      setSubmitTrigger(false);
      onSubmitSuccess(newStudent);
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [submitTrigger]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.heading}>Join the Directory</Text>

      <Text style={styles.subheading}>
        Fill in your details below to add yourself to StudentDirectory.
      </Text>

      <FormField
        label="Full Name"
        value={formData.name}
        onChangeText={(text) => updateField("name", text)}
        onBlur={() => markTouched("name")}
        placeholder="e.g. Ali Hashemi Rafsanjani"
        error={getFieldError("name")}
      />

      <FormField
        label="Student ID"
        value={formData.studentId}
        onChangeText={(text) => updateField("studentId", text)}
        onBlur={() => markTouched("studentId")}
        placeholder="e.g. 22-48348-3"
        autoCapitalize="none"
        error={getFieldError("studentId")}
      />

      <FormField
        label="Email"
        value={formData.email}
        onChangeText={(text) => updateField("email", text)}
        onBlur={() => markTouched("email")}
        placeholder="e.g. rafsan@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        error={getFieldError("email")}
      />

      <FormField
        label="Department"
        value={formData.department}
        onChangeText={(text) => updateField("department", text)}
        onBlur={() => markTouched("department")}
        placeholder="e.g. Computer Science"
        error={getFieldError("department")}
      />

      <FormField
        label="Bio"
        value={formData.bio}
        onChangeText={(text) => updateField("bio", text)}
        onBlur={() => markTouched("bio")}
        placeholder="A short sentence about yourself..."
        multiline
        error={getFieldError("bio")}
      />

      <Text
        style={[
          styles.counter,
          formData.bio.length > 200 && styles.counterDanger,
        ]}
      >
        {formData.bio.length} / 200 characters
      </Text>

      <FormField
        label="Skills (comma-separated)"
        value={formData.skillsText}
        onChangeText={(text) => updateField("skillsText", text)}
        onBlur={() => markTouched("skillsText")}
        placeholder="e.g. React Native, TypeScript, Figma"
        autoCapitalize="none"
      />

      <View style={styles.buttonRow}>
        <Pressable
          style={styles.cancelButton}
          onPress={handleCancelPress}
          disabled={isSubmitting}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>

        <Pressable
          style={[
            styles.submitButton,
            (!isFormValid || isSubmitting) && styles.buttonDisabled,
          ]}
          onPress={handleSubmitPress}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Join Directory</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  heading: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0D1F4E",
    marginBottom: 4,
  },

  subheading: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 24,
    lineHeight: 19,
  },

  counter: {
    fontSize: 11,
    color: "#64748B",
    textAlign: "right",
    marginTop: -10,
    marginBottom: 16,
  },

  counterDanger: {
    color: "#DC2626",
    fontWeight: "700",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    marginBottom: 32,
  },

  cancelButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
  },

  cancelButtonText: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "700",
  },

  submitButton: {
    flex: 1,
    backgroundColor: "#0D9488",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },

  buttonDisabled: {
    backgroundColor: "#CBD5E1",
  },

  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});