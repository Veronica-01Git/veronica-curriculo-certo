import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ResumeData } from "@/types/resume";
import { baseStyles } from "./shared";

const execStyles = StyleSheet.create({
  header: {
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#111113",
    paddingBottom: 12,
  },
  name: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  sectionTitle: {
    ...baseStyles.sectionTitle,
    fontSize: 12,
    letterSpacing: 1,
  },
  role: {
    fontSize: 11.5,
    fontFamily: "Helvetica-Bold",
  },
  company: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: "#3A3A3F",
  },
});

export function ExecutiveAtsTemplate({ data }: { data: ResumeData }) {
  const contactParts = [data.contact.email, data.contact.phone, data.contact.location, data.contact.linkedin].filter(
    Boolean
  );

  return (
    <Document title={`${data.contact.fullName} - Currículo`} author="VERONICA - Currículo Certo">
      <Page size="A4" style={baseStyles.page}>
        <View style={execStyles.header}>
          <Text style={execStyles.name}>{data.contact.fullName}</Text>
          {contactParts.length > 0 && <Text style={baseStyles.contactLine}>{contactParts.join("   |   ")}</Text>}
        </View>

        {data.summary && (
          <View>
            <Text style={execStyles.sectionTitle}>Sumário Executivo</Text>
            <Text style={baseStyles.paragraph}>{data.summary}</Text>
          </View>
        )}

        {data.experiences.length > 0 && (
          <View>
            <Text style={execStyles.sectionTitle}>Trajetória Profissional</Text>
            {data.experiences.map((exp, i) => (
              <View key={i} style={baseStyles.entryBlock}>
                <Text style={execStyles.role}>{exp.role}</Text>
                <Text style={execStyles.company}>
                  {exp.company}
                  {exp.location ? ` — ${exp.location}` : ""}
                </Text>
                {(exp.startDate || exp.endDate) && (
                  <Text style={baseStyles.metaLine}>{[exp.startDate, exp.endDate].filter(Boolean).join(" – ")}</Text>
                )}
                {exp.bullets.map((b, j) => (
                  <Text key={j} style={baseStyles.bullet}>
                    ▸ {b}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {data.skills.length > 0 && (
          <View>
            <Text style={execStyles.sectionTitle}>Competências Estratégicas</Text>
            <Text style={baseStyles.skillsText}>{data.skills.join(" • ")}</Text>
          </View>
        )}

        {data.education.length > 0 && (
          <View>
            <Text style={execStyles.sectionTitle}>Formação</Text>
            {data.education.map((ed, i) => (
              <View key={i} style={baseStyles.entryBlock}>
                <Text style={execStyles.role}>{ed.degree}</Text>
                <Text style={baseStyles.metaLine}>{ed.institution}</Text>
              </View>
            ))}
          </View>
        )}

        {(data.certifications.length > 0 || data.languages.length > 0) && (
          <View>
            <Text style={execStyles.sectionTitle}>Certificações & Idiomas</Text>
            <Text style={baseStyles.paragraph}>
              {[...data.certifications, ...data.languages].join(" • ")}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
