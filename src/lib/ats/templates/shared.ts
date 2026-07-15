import { StyleSheet } from "@react-pdf/renderer";

/**
 * Regras compartilhadas por todos os templates para garantir compatibilidade
 * máxima com parsers de ATS: fontes padrão, coluna única, sem tabelas,
 * sem texto em imagem, sem caixas de texto flutuantes.
 */
export const baseStyles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 10.5,
    color: "#111113",
    lineHeight: 1.4,
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  contactLine: {
    fontSize: 9.5,
    color: "#3A3A3F",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 14,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D8DC",
    paddingBottom: 3,
  },
  paragraph: {
    fontSize: 10.2,
    marginBottom: 8,
  },
  role: {
    fontSize: 10.8,
    fontFamily: "Helvetica-Bold",
  },
  metaLine: {
    fontSize: 9.5,
    color: "#3A3A3F",
    marginBottom: 4,
  },
  bullet: {
    fontSize: 10.2,
    marginBottom: 3,
    paddingLeft: 10,
  },
  entryBlock: {
    marginBottom: 10,
  },
  skillsText: {
    fontSize: 10.2,
  },
});
