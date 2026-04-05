import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, X } from "lucide-react";

interface DomainWarrantyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
  domainCount: number;
}

export function DomainWarrantyModal({ 
  isOpen, 
  onClose, 
  onAccept, 
  onDecline, 
  domainCount 
}: DomainWarrantyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-lg">
            We suggest <span className="font-bold">Domain Warranty & Privacy</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">{domainCount} domain</span> in cart is missing this addon
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Never risk losing a domain</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>ABANCOOL will renew the domain for you in case you forgot</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>Domain Privacy turned on for your security</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">•</span>
              <span>
                <span className="text-red-600">Domain privacy is available only if supported by the registrar</span>
              </span>
            </li>
          </ul>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onDecline}
              className="flex-1"
            >
              no, thank you
            </Button>
            <Button 
              onClick={onAccept}
              className="flex-1 bg-green-500 hover:bg-green-600"
            >
              yes, go back to cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}