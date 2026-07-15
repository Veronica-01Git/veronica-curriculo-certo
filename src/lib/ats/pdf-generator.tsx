import { renderToBuffer } from "@react-pdf/renderer";
import type { ResumeData, TemplateKey } from "@/types/resume";
import { ClassicAtsTemplate } from "./templates/template-classic";
import { ModernAtsTemplate } from "./templates/template-modern";
import { ExecutiveAtsTemplate } from "./templates/template-executive";

/**
 * Gera o PDF final do currículo no template escolhido.
 * Todos os templates seguem as regras de compatibilidade ATS: coluna única,
 * texto real (não imagem), sem tabelas e sem caixas flutuantes.
 */
export async function generateResumePdf(data: ResumeData, template: TemplateKey): Promise<Buffer> {
  const doc =
    template === "MODERN_ATS" ? (
      <ModernAtsTemplate data={data} />
    ) : template === "EXECUTIVE_ATS" ? (
      <ExecutiveAtsTemplate data={data} />
    ) : (
      <ClassicAtsTemplate data={data} />
    );

  return renderToBuffer(doc);
}
