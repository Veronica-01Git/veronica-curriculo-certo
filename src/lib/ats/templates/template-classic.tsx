import { Document, Page, Text, View } from "@react-pdf/renderer";
import type { ResumeData } from "@/types/resume";
import { baseStyles } from "./shared";

export function ClassicAtsTemplate({ data }: { data: ResumeData }) {
  const contactParts = [data.contact.email, data.contact.phone, data.contact.location, data.contact.linkedin].filter(
    Boolean
  );

  return (
    <Document title={`${data.contact.fullName} - Currículo`} author="VERONICA - Currículo Certo">
      <Page size="A4" style={baseStyles.page}>
        <Text style={baseStyles.name}>{data.contact.fullName}</Text>
        {contactParts.length > 0 && <Text style={baseStyles.contactLine}>{contactParts.join("  •  ")}</Text>}

        {data.summary && (
          <View>
            <Text style={baseStyles.sectionTitle}>Resumo Profissional</Text>
            <Text style={baseStyles.paragraph}>{data.summary}</Text>
          </View>
        )}

        {data.skills.length > 0 && (
          <View>
            <Text style={baseStyles.sectionTitle}>Habilidades</Text>
            <Text style={baseStyles.skillsText}>{data.skills.join(" • ")}</Text>
          </View>
        )}

        {data.experiences.length > 0 && (
          <View>
            <Text style={baseStyles.sectionTitle}>Experiência Profissional</Text>
            {data.experiences.map((exp, i) => (
              <View key={i} style={baseStyles.entryBlock}>
                <Text style={baseStyles.role}>
                  {exp.role} — {exp.company}
                </Text>
                {(exp.startDate || exp.endDate || exp.location) && (
                  <Text style={baseStyles.metaLine}>
                    {[exp.startDate, exp.endDate].filter(Boolean).join(" – ")}
                    {exp.location ? `  •  ${exp.location}` : ""}
                  </Text>
                )}
                {exp.bullets.map((b, j) => (
                  <Text key={j} style={baseStyles.bullet}>
                    • {b}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        )}

        {data.education.length > 0 && (
          <View>
            <Text style={baseStyles.sectionTitle}>Formação Acadêmica</Text>
            {data.education.map((ed, i) => (
              <View key={i} style={baseStyles.entryBlock}>
                <Text style={baseStyles.role}>{ed.degree}</Text>
                <Text style={baseStyles.metaLine}>
                  {ed.institution}
                  {ed.startDate || ed.endDate ? `  •  ${[ed.startDate, ed.endDate].filter(Boolean).join(" – ")}` : ""}
                </Text>
              </View>
            ))}
          </View>
        )}

        {data.certifications.length > 0 && (
          <View>
            <Text style={baseStyles.sectionTitle}>Certificações</Text>
            <Text style={baseStyles.paragraph}>{data.certifications.join(" • ")}</Text>
          </View>
        )}

        {data.languages.length > 0 && (
          <View>
            <Text style={baseStyles.sectionTitle}>Idiomas</Text>
            <Text style={baseStyles.paragraph}>{data.languages.join(" • ")}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
