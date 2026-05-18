-- ============================================================
-- ORTO-IA — Knowledge Base Seeds
-- 8 autores: Steiner, McNamara, Tweed, Ricketts, Interlandi,
--            Nanda, Downs, Angle
-- ============================================================

-- ── STEINER ──────────────────────────────────────────────────
INSERT INTO knowledge_base (author, title, content, measurement, category, norm_value, norm_sd, norm_unit, source, year_published) VALUES
('steiner', 'SNA — Posição Sagital da Maxila',
'O ângulo SNA mede a posição ântero-posterior da maxila em relação à base do crânio. Norma: 82° ± 2°. SNA > 84°: protrusão maxilar. SNA < 80°: retrusão maxilar. REGRA: SNA > 84° com ANB aumentado → avaliar Le Fort I ou máscara facial em crescimento.',
'SNA', 'norm', 82.0, 2.0, 'degrees', 'Steiner CC. Am J Orthod. 1953;39(10):729-755.', 1953),

('steiner', 'SNB — Posição Sagital da Mandíbula',
'O ângulo SNB mede a posição da mandíbula. Norma: 80° ± 2°. SNB > 82°: prognatismo mandibular (Classe III). SNB < 78°: retrognatia (Classe II). SNB < 76° em crescimento → aparelho funcional indicado.',
'SNB', 'norm', 80.0, 2.0, 'degrees', 'Steiner CC. Am J Orthod. 1953;39(10):729-755.', 1953),

('steiner', 'ANB — Discrepância Sagital Maxilo-Mandibular',
'ANB = SNA - SNB. Norma: 2° ± 2°. ANB 0-4°: Classe I; ANB > 4°: Classe II; ANB < 0°: Classe III. REGRA IMUTÁVEL: ANB < -2° → Classe III obrigatória. Correlacionar com Wits.',
'ANB', 'interpretation', 2.0, 2.0, 'degrees', 'Steiner CC. Am J Orthod. 1960;46(10):721-735.', 1960),

('steiner', 'Incisivo Superior à Linha NA',
'Norma: 4mm e 22°. 1.NA > 4mm: protrusão dos incisivos superiores — OBRIGATÓRIO na lista de problemas. 1.NA aumentado + overjet aumentado → extração de pré-molares superiores para retração.',
'1.NA', 'interpretation', 4.0, 1.5, 'mm', 'Steiner CC. Am J Orthod. 1953;39(10):729-755.', 1953),

('steiner', 'Incisivo Inferior à Linha NB',
'Norma: 4mm e 25°. 1.NB > 4mm + IMPA > 95°: protrusão evidente. Triângulo de Tweed: FMIA=65°, IMPA=90°, FMA=25°.',
'1.NB', 'interpretation', 4.0, 1.5, 'mm', 'Steiner CC. Am J Orthod. 1953;39(10):729-755.', 1953);

-- ── McNAMARA ─────────────────────────────────────────────────
INSERT INTO knowledge_base (author, title, content, measurement, category, norm_value, norm_sd, norm_unit, source, year_published) VALUES
('mcnamara', 'Co-A — Comprimento Efetivo da Maxila',
'Distância Côndilon-A. Norma feminino: ~92mm. Déficit de Co-A → retrusão maxilar pura. Co-A diminuído em crescimento → máscara facial indicada.',
'Co-A', 'norm', 92.0, 4.5, 'mm', 'McNamara JA Jr. Am J Orthod. 1984;86(6):449-469.', 1984),

('mcnamara', 'Co-Gn — Comprimento Efetivo da Mandíbula',
'Distância Côndilon-Gnátio. Norma feminino: ~121mm. Diferença Co-Gn - Co-A ideal: 25-28mm. Diferença > 30mm → mandíbula relativamente longa.',
'Co-Gn', 'norm', 121.0, 5.5, 'mm', 'McNamara JA Jr. Am J Orthod. 1984;86(6):449-469.', 1984),

('mcnamara', 'Wits Appraisal — Relação Sagital Independente de Sella',
'Perpendiculares ao plano oclusal pelos pontos A e B. Norma: 0mm ± 2. Wits > +2mm: Classe II. Wits < -2mm: Classe III. REGRA: ANB < -2° E Wits < -2mm → confirmação bilateral de Classe III.',
'WITS', 'interpretation', 0.0, 2.0, 'mm', 'Jacobson A. Am J Orthod. 1975;67(2):125-138.', 1975),

('mcnamara', 'AFH/PFH — Proporção das Alturas Faciais',
'Índice de Jarabak: PFH/AFH. Norma: 0.62-0.65. < 0.60: dolicofacial severo. > 0.70: braquifacial. Dolicofacial + AFH aumentada → controle vertical rigoroso, sem expansores.',
'AFH', 'interpretation', 65.0, 3.0, 'mm', 'McNamara JA Jr. Am J Orthod. 1984;86(6):449-469.', 1984);

-- ── TWEED ────────────────────────────────────────────────────
INSERT INTO knowledge_base (author, title, content, measurement, category, norm_value, norm_sd, norm_unit, source, year_published) VALUES
('tweed', 'FMA — Ângulo Mandibular de Frankfort',
'Plano de Frankfort x Plano Mandibular. Norma: 25° ± 4°. < 22°: braquifacial. 22-28°: mesofacial. > 28°: dolicofacial. REGRA IMUTÁVEL: FMA > 32° com extrações → ancoragem MÁXIMA obrigatória. FMA > 35° → avaliar cirurgia ortognática.',
'FMA', 'interpretation', 25.0, 4.0, 'degrees', 'Tweed CH. Angle Orthod. 1954;24(3):121-169.', 1954),

('tweed', 'IMPA — Inclinação dos Incisivos Inferiores',
'Ângulo do incisivo inferior com o plano mandibular. Norma: 90° ± 5°. REGRA IMUTÁVEL: IMPA > 100° → protrusão dos incisivos inferiores OBRIGATÓRIO na lista de problemas. IMPA > 95° em extração → ancoragem reforçada.',
'IMPA', 'interpretation', 90.0, 5.0, 'degrees', 'Tweed CH. Angle Orthod. 1954;24(3):121-169.', 1954),

('tweed', 'FMIA — Ângulo de Frankfort com Incisivo Inferior',
'Ângulo entre plano de Frankfort e eixo longo do incisivo inferior. Norma: 65° ± 5°. Triângulo de Tweed: FMA + IMPA + FMIA = 180°. FMIA < 60° indica protrusão significativa do incisivo inferior.',
'FMIA', 'norm', 65.0, 5.0, 'degrees', 'Tweed CH. Angle Orthod. 1954;24(3):121-169.', 1954);

-- ── RICKETTS ─────────────────────────────────────────────────
INSERT INTO knowledge_base (author, title, content, measurement, category, norm_value, norm_sd, norm_unit, source, year_published) VALUES
('ricketts', 'Eixo Facial de Ricketts',
'Ângulo Basion-Nasion x Eixo Facial (Pterigóide-Gnátio). Norma: 90° ± 3°. < 87°: crescimento vertical (dolicofacial). > 93°: crescimento horizontal (braquifacial). Cada 1° de desvio ≈ 0.8mm de alteração no mento.',
'FACIAL_AXIS', 'norm', 90.0, 3.0, 'degrees', 'Ricketts RM. Am J Orthod. 1982;81(5):351-370.', 1982),

('ricketts', 'Convexidade Facial de Ricketts',
'Distância ponto A ao plano facial (Nasion-Pogônio). Norma: 2mm ± 2. > 4mm: Classe II (face convexa). < 0mm: Classe III (face côncava). Decresce ~0.2mm/ano. Convexidade > 6mm em adulto → considerar Le Fort I.',
'CONVEXITY', 'norm', 2.0, 2.0, 'mm', 'Ricketts RM. Angle Orthod. 1957;27(1):14-37.', 1957);

-- ── INTERLANDI ───────────────────────────────────────────────
INSERT INTO knowledge_base (author, title, content, measurement, category, norm_value, norm_sd, norm_unit, source, year_published) VALUES
('interlandi', 'Traçado Cefalométrico Padrão USP',
'Análise USP integra posição dentária, relação esquelética e perfil facial. Referência: plano de Frankfurt. SNA 82° ± 3°, SNB 80° ± 3°, ANB 2° ± 2°, FMA 25° ± 5°, IMPA 90° ± 5°. Avaliação especial da via aérea e ATM. Terço inferior ideal = 55-58% da altura total facial.',
'USP_ANALYSIS', 'interpretation', 0.0, 0.0, 'mixed', 'Interlandi S. Ortopedia das Bases Apicais. 4a ed. São Paulo; 2002.', 2002),

('interlandi', 'Análise dos Terços Faciais — Proporção Áurea',
'Terços: superior (trichion-glabela), médio (glabela-subnasal), inferior (subnasal-mento). Em harmonia, os três são iguais. Terço inferior: 1/3 lábio superior + 2/3 lábio inferior/mento. Terço inferior aumentado → dolicofacial. Terço inferior diminuído → braquifacial. Ângulo nasolabial ideal: 90-110°.',
'FACIAL_THIRDS', 'interpretation', 0.0, 0.0, 'ratio', 'Interlandi S. Ortopedia das Bases Apicais. 4a ed. São Paulo; 2002.', 2002);

-- ── NANDA ────────────────────────────────────────────────────
INSERT INTO knowledge_base (author, title, content, measurement, category, norm_value, norm_sd, norm_unit, source, year_published) VALUES
('nanda', 'Biomecânica de Ancoragem — Critérios de Nanda',
'Ancoragem esquelética (mini-implantes) indicada quando: FMA > 30° com retração, IMPA > 95° com extração, sobressaliência > 8mm, assimetrias dentárias. Ancoragem: mínima (< 25% perda), moderada (25-50%), máxima (< 25%). Mini-implantes: entre 2° PM e 1° molar superior para retração em massa.',
'ANCHORAGE', 'protocol', 0.0, 0.0, 'clinical', 'Nanda R. Temporary Anchorage Devices. Mosby; 2009.', 2009),

('nanda', 'Sistemas de Forças e Mecânica Ortodôntica',
'Princípios de Nanda: (1) Linha de ação da força deve passar pelo centro de resistência para movimento de corpo. (2) Torque de coroa lingual nos incisivos superiores (B2 = -7°) para compensar retração. (3) Retração em dois tempos ou em massa com TAD. (4) Dolicofaciais: arcos rígidos com curva reversa de Spee.',
'MECHANICS', 'protocol', 0.0, 0.0, 'clinical', 'Nanda R. Biomechanics and Esthetic Strategies. Elsevier; 2005.', 2005);

-- ── DOWNS ────────────────────────────────────────────────────
INSERT INTO knowledge_base (author, title, content, measurement, category, norm_value, norm_sd, norm_unit, source, year_published) VALUES
('downs', 'Ângulo Facial de Downs',
'Plano de Frankfort x Plano Facial (Nasion-Pogônio). Norma: 87.8° ± 3.6°. < 84°: retrognatismo. 84-92°: normal. > 92°: prognatismo. Ângulo facial reduzido em Classe II confirma componente mandibular.',
'FACIAL_ANGLE', 'norm', 87.8, 3.6, 'degrees', 'Downs WB. Am J Orthod. 1948;34(10):812-840.', 1948),

('downs', 'Ângulo de Convexidade de Downs',
'Linha NA x Plano Facial (Nasion-Pogônio). Norma: 0° ± 5°. Positivo: maxila proeminente (Classe II, face convexa). Negativo: prognatismo mandibular (Classe III, face côncava). > +5° em adulto com ANB > 5° → discrepância esquelética significativa.',
'CONVEXITY_ANGLE', 'norm', 0.0, 5.0, 'degrees', 'Downs WB. Am J Orthod. 1948;34(10):812-840.', 1948),

('downs', 'Eixo Y de Crescimento de Downs',
'Ângulo Sella-Gnátio x Plano de Frankfort. Norma: 59.4° ± 3.8°. < 55°: padrão extremamente horizontal (mordida profunda). > 66°: padrão extremamente vertical (mordida aberta). Fundamental para prognóstico em crescimento.',
'Y_AXIS', 'norm', 59.4, 3.8, 'degrees', 'Downs WB. Angle Orthod. 1956;26(4):191-212.', 1956),

('downs', 'Plano Oclusal de Downs',
'Plano Oclusal x Plano de Frankfort. Norma: 9.3° ± 3.8°. > 13°: dolicofacial com rotação anti-horária. < 5°: braquifacial com sobremordida profunda. Em Classe II com plano inclinado: intrusão de molares superiores pode auxiliar avanço mandibular.',
'OCCLUSAL_PLANE', 'norm', 9.3, 3.8, 'degrees', 'Downs WB. Am J Orthod. 1948;34(10):812-840.', 1948);

-- ── ANGLE ────────────────────────────────────────────────────
INSERT INTO knowledge_base (author, title, content, measurement, category, norm_value, norm_sd, norm_unit, source, year_published) VALUES
('angle', 'Classificação de Angle — Classe I',
'Cúspide mésio-vestibular do 1° molar superior oclui no sulco mésio-vestibular do 1° molar inferior. ANB 0-4°. Má-oclusão envolve apinhamento, espaçamento, mordida profunda/aberta dentária. Extrações indicadas quando Little Index > 5mm.',
'CLASS_I', 'classification', 0.0, 0.0, 'categorical', 'Angle EH. Dental Cosmos. 1899;41(3):248-264.', 1899),

('angle', 'Classificação de Angle — Classe II Divisão 1',
'Relação molar distal com incisivos superiores protuídos (overjet > 5mm). ANB > 4°. Overjet acentuado, lábio inferior hiperativo. Em crescimento: Bionator, Twin Block, Herbst. Adultos: extrações ou cirurgia se ANB > 7°.',
'CLASS_II_DIV1', 'classification', 0.0, 0.0, 'categorical', 'Angle EH. Dental Cosmos. 1899;41(3):248-264.', 1899),

('angle', 'Classificação de Angle — Classe II Divisão 2',
'Relação molar distal com incisivos superiores retroinclinados (1.NA reduzido). Laterais superiores protuídos e rotacionados. Sobremordida profunda comum. Perfil harmonioso apesar da Classe II. Protocolo: torque vestibular nos incisivos como primeiro passo.',
'CLASS_II_DIV2', 'classification', 0.0, 0.0, 'categorical', 'Angle EH. Dental Cosmos. 1899;41(3):248-264.', 1899),

('angle', 'Classificação de Angle — Classe III',
'Relação molar mesial. Classe III verdadeira (esquelética: ANB < -2°, Wits < -2mm) vs Pseudoclasse III (funcional). Diagnóstico diferencial em repouso mandibular. Em crescimento até 10-11 anos: máscara facial. Adultos: cirurgia bimaxilar. REGRA: ANB < -2° confirma componente esquelético.',
'CLASS_III', 'classification', 0.0, 0.0, 'categorical', 'Angle EH. Dental Cosmos. 1899;41(3):248-264.', 1899);

-- ── VALIDAÇÃO CLÍNICA ────────────────────────────────────────
INSERT INTO knowledge_base (author, title, content, measurement, category, norm_value, norm_sd, norm_unit, source, year_published) VALUES
('validation', 'R1 — ANB < -2° indica Classe III',
'REGRA IMUTÁVEL: ANB < -2° → diagnóstico OBRIGATÓRIO de Classe III esquelética. Classe I requer ANB entre 0° e 4°. Confirmar com Wits < -2mm.',
'ANB', 'validation', -2.0, 0.0, 'degrees', 'Consenso Clínico Orto-IA.', 2026),

('validation', 'R2 — FMA > 32° exige ancoragem máxima',
'REGRA IMUTÁVEL: FMA > 32° com extrações → ancoragem MÁXIMA obrigatória. Mini-implantes ou arco extrabucal pull alto para controle vertical.',
'FMA', 'validation', 32.0, 0.0, 'degrees', 'Consenso Clínico Orto-IA.', 2026),

('validation', 'R3 — IMPA > 100° na lista de problemas',
'REGRA IMUTÁVEL: IMPA > 100° → protrusão dos incisivos inferiores OBRIGATÓRIO na Lista de Problemas de Ackerman-Proffit.',
'IMPA', 'validation', 100.0, 0.0, 'degrees', 'Consenso Clínico Orto-IA.', 2026);
