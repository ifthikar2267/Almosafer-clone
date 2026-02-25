"use client";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { ChevronDown } from "lucide-react";

export default function FAQSection({ faqList = [] }) {
  const list = Array.isArray(faqList) ? faqList : [];

  if (list.length === 0) {
    return (
      <section className="py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-600">No FAQ available for this hotel.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
        {list.map((item, i) => (
          <Accordion
            key={i}
            disableGutters
            elevation={0}
            sx={{
              "&:before": { display: "none" },
              borderTop: i === 0 ? "none" : "1px solid",
              borderColor: "divider",
            }}
          >
            <AccordionSummary expandIcon={<ChevronDown size={20} />} sx={{ px: 3, py: 1.5 }}>
              <span className="font-medium text-gray-900">
                {item.question ?? item.q ?? item.question_ar ?? `Question ${i + 1}`}
              </span>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, pt: 0, pb: 2 }}>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.answer ?? item.a ?? item.answer_ar ?? ""}
              </p>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </section>
  );
}
