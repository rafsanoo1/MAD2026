// app/(tabs)/index.tsx

import { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AddStudentForm from "../../components/add-student-form";
import SearchBar from "../../components/search-bar";
import StudentDetail from "../../components/student-detail";
import StudentItem from "../../components/student-item";

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

const STARTER_STUDENTS: Student[] = [
  {
    id: "1",
    name: "Rakib Rahman",
    studentId: "22-12345-1",
    department: "Computer Science",
    bio: "Passionate about mobile development and building tools that make everyday life easier.",
    skills: ["React Native", "TypeScript", "Node.js"],
    avatarUrl: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Ayesha Rahman",
    studentId: "22-67890-2",
    department: "Computer Science",
    bio: "Interested in AI and full-stack web development.",
    skills: ["Python", "Machine Learning", "React"],
    avatarUrl: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "Tariq Hassan",
    studentId: "22-11111-3",
    department: "Software Engineering",
    bio: "Backend enthusiast with a love for system design and databases.",
    skills: ["Java", "Spring Boot", "PostgreSQL"],
    avatarUrl: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "4",
    name: "Nusrat Jahan",
    studentId: "22-22222-4",
    department: "Computer Science",
    bio: "UI/UX focused developer who loves turning wireframes into polished products.",
    skills: ["Figma", "React", "CSS"],
    avatarUrl: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "5",
    name: "Rafiq Islam",
    studentId: "22-33333-5",
    department: "Software Engineering",
    bio: "Competitive programmer who enjoys algorithmic challenges.",
    skills: ["C++", "Algorithms", "Python"],
    avatarUrl: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: "6",
    name: "Sumaiya Akter",
    studentId: "22-44444-6",
    department: "Computer Science",
    bio: "Interested in cloud computing and DevOps practices.",
    skills: ["AWS", "Docker", "Linux"],
    avatarUrl: "https://i.pravatar.cc/150?img=9",
  },
];

type DepartmentFilter = "All" | "Computer Science" | "Software Engineering";

const DEPARTMENT_FILTERS: DepartmentFilter[] = [
  "All",
  "Computer Science",
  "Software Engineering",
];

export default function HomeScreen() {
  const [query, setQuery] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [departmentFilter, setDepartmentFilter] =
    useState<DepartmentFilter>("All");

  const [students, setStudents] = useState<Student[]>(STARTER_STUDENTS);
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleSelect = (student: Student) => {
    setSelectedStudent((previousStudent) =>
      previousStudent?.id === student.id ? null : student
    );
  };

  const handleDepartmentFilter = (department: DepartmentFilter) => {
    setDepartmentFilter(department);
    setSelectedStudent(null);
  };

  const handleSearch = (text: string) => {
    setQuery(text);
    setSelectedStudent(null);
  };

  const handleNewStudent = (newStudent: Student) => {
    setStudents((previousStudents) => [newStudent, ...previousStudents]);
    setSelectedStudent(newStudent);
    setShowForm(false);
    setQuery("");
    setDepartmentFilter("All");
  };

  if (showForm) {
    return (
      <AddStudentForm
        onSubmitSuccess={handleNewStudent}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  const filtered = students.filter((student) => {
    const searchText = query.toLowerCase().trim();

    const matchesSearch =
      student.name.toLowerCase().includes(searchText) ||
      student.department.toLowerCase().includes(searchText) ||
      student.studentId.toLowerCase().includes(searchText);

    const matchesDepartment =
      departmentFilter === "All" || student.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StudentItem
            student={item}
            onPress={handleSelect}
            isSelected={selectedStudent?.id === item.id}
          />
        )}
        ListHeaderComponent={
          <View>
            <View style={styles.titleBar}>
              <Text style={styles.title}>Student Directory</Text>

              <View style={styles.titleRight}>
                <Text style={styles.count}>
                  {filtered.length} / {students.length}
                </Text>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowForm(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterContainer}
            >
              {DEPARTMENT_FILTERS.map((department) => (
                <TouchableOpacity
                  key={department}
                  style={[
                    styles.filterTab,
                    departmentFilter === department && styles.filterTabActive,
                  ]}
                  onPress={() => handleDepartmentFilter(department)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.filterText,
                      departmentFilter === department &&
                        styles.filterTextActive,
                    ]}
                  >
                    {department}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <SearchBar value={query} onChangeText={handleSearch} />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No students match "{query}"
            </Text>
          </View>
        }
        ListFooterComponent={
          selectedStudent ? <StudentDetail student={selectedStudent} /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },

  titleBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#0D1F4E",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  titleRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  count: {
    fontSize: 12,
    color: "#CCFBF1",
  },

  addButton: {
    backgroundColor: "#0D9488",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  filterContainer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  filterTabActive: {
    backgroundColor: "#0D9488",
    borderColor: "#0D9488",
  },

  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },

  filterTextActive: {
    color: "#FFFFFF",
  },

  empty: {
    padding: 40,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
  },
});