"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogHeader, 
//   DialogTitle,
//   DialogFooter 
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
// import { Copy, Check, ExternalLink, Clock, RefreshCw, Smartphone, ArrowUpLeft } from "lucide-react";
// import { toast } from "sonner";

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  selectedAmount, 
  selectedPackage,
  userId = "demo-user"
}: any) {
  return (
    <div className="p-4">
      <h1>Payment Modal Placeholder</h1>
      <p>Amount: {selectedAmount}</p>
      <p>Package: {selectedPackage}</p>
    </div>
  );
}