import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ResumeData } from "@/types/resume";
import { baseStyles } from "./shared";

const modernStyles = StyleSheet.create({
  name: {
    ...baseStyles.name,
    color: "#1548E0",
  },
  sectionTitle: {
    ...baseStyles.sectionTitle,
    color: "#1548E0",
    borderBottomColor: "#B3CDFF",
  },
  role: {
    ...baseStyles.role,
    color: "#111113",
  },
  pill: {
    fontSize: 9.5,
  },
});

export function ModernAtsTemplate({ data }: { data: ResumeData }) {
  const contactParts = [data.contact.email, data.contact.phone, data.contact.location, data.contact.linkedin].filter(
    Boolean
  );

  return (
    <Document title={`${data.contact.fullName} - Currículo`} author="VERONICA - Currículo Certo">
      <Page size="A4" style={baseStyles.page}>
        <Text style={modernStyles.name}>{data.contact.fullName}</Text>
        {contactParts.length > 0 && <Text style={baseStyles.contactLine}>{contactParts.join("   |   ")}</Text>}

        {data.summary && (
          <View>
            <Text style={modernStyles.sectionTitle}>Perfil</Text>
            <Text style={baseStyles.paragraph}>{data.summary}</Text>
          </View>
        )}

        {data.skills.length > 0 && (
          <View>
            <Text style={modernStyles.sectionTitle}>Principais Competências</Text>
            <Text style={modernStyles.pill}>{data.skills.join("   ·   ")}</Text>
          </View>
        )}

        {data.experiences.length > 0 && (
          <View>
            <Text style={modernStyles.sectionTitle}>Experiência</Text>
            {data.experiences.map((exp, i) => (
              <View key={i} style={baseStyles.entryBlock}>
                <Text style={modernStyles.role}>{exp.role}</Text>
                <Text style={baseStyles.metaLine}>
                  {exp.company}
                  {exp.location ? ` — ${exp.location}` : ""}
                  {exp.startDate || exp.endDate ? `   ${[exp.startDate, exp.endDate].filter(Boolean).join(" – ")}` : ""}
                </Text>
                {exp.bullets.map((b, j) => (
                  <Text key={j} style={baseStyles.bullet}>
                    – {b}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {data.education.length > 0 && (
          <View>
            <Text style={modernStyles.sectionTitle}>Formação</Text>
            {data.education.map((ed, i) => (
              <View key={i} style={baseStyles.entryBlock}>
                <Text style={modernStyles.role}>{ed.degree}</Text>
                <Text style={baseStyles.metaLine}>
                  {ed.institution}
                  {ed.startDate || ed.endDate ? `   ${[ed.startDate, ed.endDate].filter(Boolean).join(" – ")}` : ""}
                </Text>
              </View>
            ))}
          </View>
        )}

        {data.certifications.length > 0 && (
          <View>
            <Text style={modernStyles.sectionTitle}>Certificações</Text>
            <Text style={baseStyles.paragraph}>{data.certifications.join("   ·   ")}</Text>
          </View>
        )}

        {data.languages.length > 0 && (
          <View>
            <Text style={modernStyles.sectionTitle}>Idiomas</Text>
            <Text style={baseStyles.paragraph}>{data.languages.join("   ·   ")}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
