// ============================================================
// Configuration des paiements Mobile Money
// Les numéros viennent des variables d'environnement (.env.local)
// ============================================================

export type PaymentOperatorId = "orange" | "wave_moov" | "wave_mtn";

export interface PaymentOperator {
  id: PaymentOperatorId;
  label: string;
  hint: string;
  icon: string;
  number?: string;
}

export const PRICE_XOF = 10_000;

export const formatPrice = (n: number) =>
  `${new Intl.NumberFormat("fr-FR").format(n)} FCFA`;

export const PAYMENT_OPERATORS: PaymentOperator[] = [
  {
    id: "orange",
    label: "Orange Money",
    hint: "Depuis l'app Orange Money",
    icon: "🟠",
    number: process.env.NEXT_PUBLIC_PAY_ORANGE_NUMBER,
  },
  {
    id: "wave_moov",
    label: "Wave (Moov)",
    hint: "Depuis l'app Wave — ligne Moov",
    icon: "🌊",
    number: process.env.NEXT_PUBLIC_PAY_WAVE_MOOV_NUMBER,
  },
  {
    id: "wave_mtn",
    label: "Wave (MTN)",
    hint: "Depuis l'app Wave — ligne MTN",
    icon: "🟡",
    number: process.env.NEXT_PUBLIC_PAY_WAVE_MTN_NUMBER,
  },
];