import { TradeSite } from "@/components/trade-site";
export const dynamic = "force-static";
export const metadata={
  title:{absolute:"Logistics that works as hard as you do."},
  description:"One point of contact and full supply-chain visibility, origin to destination.",
};
export default function Page(){return <TradeSite page="home"/>;}
