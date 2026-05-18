class ClinicalValidator:
    def __init__(self, measurements: dict, proposed_plan: dict):
        self.m = measurements
        self.plan = proposed_plan

    def validate(self) -> tuple[dict, list[str]]:
        warnings = []
        plan = dict(self.plan)
        anb = self.m.get("anb", 2.0)
        fma = self.m.get("fma", 25.0)
        impa = self.m.get("impa", 90.0)
        wits = self.m.get("wits", 0.0)
        u1_na = self.m.get("u1_na_mm", 4.0)

        if anb < -2.0:
            warnings.append("R1: ANB < -2° — diagnóstico deve incluir Classe III esquelética.")
        if fma > 32.0 and plan.get("extractions"):
            plan["anchorage"] = "Máxima (mini-implantes obrigatórios)"
            warnings.append("R2: FMA > 32° com extrações — ancoragem máxima aplicada.")
        if impa > 100.0:
            warnings.append("R3: IMPA > 100° — protrusão dos incisivos inferiores na lista de problemas.")
        if wits < -2.0 and anb < -2.0:
            warnings.append("R4: Wits < -2mm confirma Classe III esquelética.")
        if u1_na > 4.0:
            warnings.append("R5: 1.NA > 4mm — incisivos superiores protruídos na lista de problemas.")
        if anb < -4.0 or anb > 7.0 or fma > 35.0 or abs(wits) > 8.0:
            warnings.append("R8: Discrepância severa — avaliar indicação cirúrgica.")

        return plan, warnings
