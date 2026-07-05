// app/(tabs)/index.tsx

import ProfileCard from "@/components/profile-card";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.title}>StudentCard</Text>
        <Text style={styles.subtitle}>Mobile Application Development</Text>
      </View>

      <ProfileCard
        name="Ali Hashemi Rafsanjani"
        studentId="22-48348-3"
        department="Computer Science — AIUB"
        bio="I am a Software Engineering student interested in mobile app development, web technologies, data science, and building practical software solutions."
        skills={[
          "React Native",
          "TypeScript",
          "JavaScript",
          "C#",
          ".NET",
          "Python",
        ]}
      />

      <ProfileCard
        name="Rakib Rahman"
        studentId="22-67890-2"
        department="Computer Science — AIUB"
        bio="Interested in AI and full-stack web development. Loves competitive programming and solving real-world problems through code."
        skills={[
          "Python",
          "Machine Learning",
          "React",
          "Django",
        ]}
      />

      <ProfileCard
        name="Saad Al Rafi"
        studentId="22-54321-3"
        department="Software Engineering — AIUB"
        bio="Aspiring software engineer with a passion for mobile apps, UI/UX design, and modern application development."
        skills={[
          "UI/UX",
          "Figma",
          "Java",
          "Mobile Apps",
        ]}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F0F4F8",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
  },

  header: {
    alignItems: "center",
    marginBottom: 22,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0D1F4E",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
  },
});