export interface ResumeContact {
  fullName: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface ResumeExperience {
  role: string;
  company: string;
  location?: string;
  startDate?: string;
  endDate?: string; // "Atual" quando em andamento
  bullets: string[];
}

export interface ResumeEducation {
  degree: string;
  institution: string;
  startDate?: string;
  endDate?: string;
}

export interface ResumeData {
  contact: ResumeContact;
  summary: string;
  skills: string[];
  experiences: ResumeExperience[];
  education: ResumeEducation[];
  certifications: string[];
  languages: string[];
}

export interface AtsIssue {
  severity: "critical" | "warning" | "tip";
  message: string;
}

export interface AtsAnalysis {
  score: number; // 0-100
  matchedKeywords: string[];
  missingKeywords: string[];
  issues: AtsIssue[];
}

export type TemplateKey = "CLASSIC_ATS" | "MODERN_ATS" | "EXECUTIVE_ATS";

export interface TemplateMeta {
  key: TemplateKey;
  name: string;
  description: string;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    key: "CLASSIC_ATS",
    name: "Clássico ATS",
    description: "Layout de coluna única, máxima compatibilidade com qualquer parser de ATS.",
  },
  {
    key: "MODERN_ATS",
    name: "Moderno ATS",
    description: "Tipografia refinada e hierarquia clara, mantendo 100% de leitura por robôs.",
  },
  {
    key: "EXECUTIVE_ATS",
    name: "Executivo ATS",
    description: "Indicado para cargos sênior e de liderança, com destaque para resultados.",
  },
];
