"use client";

import { useState } from "react";
import { Pencil, Plus, X } from "lucide-react";
import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RatingLine } from "@/components/shared/RatingLine";
import { useBusiness, useRepository, useServicesForBusiness } from "@/app-state/hooks";
import { CATEGORY_LABELS, CURRENT_BUSINESS_ID } from "@/domain/constants";
import { formatPrice } from "@/domain/pricing";
import type { BusinessService } from "@/domain/types";
import { cn } from "@/lib/utils";

export default function BusinessProfilePage() {
  const business = useBusiness(CURRENT_BUSINESS_ID);
  const services = useServicesForBusiness(CURRENT_BUSINESS_ID);
  const [addingNew, setAddingNew] = useState(false);

  if (!business) return null;

  return (
    <div>
      <ScreenHeader title="Business" />
      <div className="mx-auto max-w-xl px-4 pt-4 pb-10">
        <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-4">
          <p className="text-lg font-bold text-foreground">{business.name}</p>
          <p className="text-[13.5px] text-muted-foreground">
            {CATEGORY_LABELS[business.category]} · {business.location.area}
          </p>
          <RatingLine rating={business.rating} reviewCount={business.reviewCount} className="mt-1.5" />
          <p className="mt-2 text-[13.5px] leading-relaxed text-foreground">{business.description}</p>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-foreground">Services</h2>
          <button
            type="button"
            onClick={() => setAddingNew((v) => !v)}
            className="inline-flex items-center gap-1 text-[13.5px] font-medium text-primary"
          >
            {addingNew ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {addingNew ? "Cancel" : "Add service"}
          </button>
        </div>

        {addingNew && (
          <NewServiceForm
            onCreated={() => setAddingNew(false)}
            onCancel={() => setAddingNew(false)}
          />
        )}

        <div className="mt-3 flex flex-col gap-2.5">
          {services.map((service) => (
            <ServiceRow key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ServiceRow({ service }: { service: BusinessService }) {
  const repository = useRepository();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(service.name);
  const [duration, setDuration] = useState(String(service.durationMinutes));
  const [price, setPrice] = useState(String(service.normalPrice));

  function save() {
    repository.updateService(service.id, {
      name,
      durationMinutes: Number(duration) || service.durationMinutes,
      normalPrice: Number(price) || service.normalPrice,
    });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="space-y-2.5 rounded-[var(--radius-lg)] border border-primary bg-surface p-4">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Service name" />
        <div className="flex gap-2.5">
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="Minutes"
          />
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="€ Price" />
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={save}>
            Save
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-4",
        !service.active && "opacity-50",
      )}
    >
      <div>
        <p className="text-[15px] font-semibold text-foreground">{service.name}</p>
        <p className="text-[13px] text-muted-foreground">
          {service.durationMinutes} min · {formatPrice(service.normalPrice)}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-muted-foreground hover:text-foreground"
          aria-label={`Edit ${service.name}`}
        >
          <Pencil className="h-4 w-4" />
        </button>
        <label className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
          Active
          <input
            type="checkbox"
            checked={service.active}
            onChange={(e) => repository.updateService(service.id, { active: e.target.checked })}
            className="h-4.5 w-4.5 accent-primary"
          />
        </label>
      </div>
    </div>
  );
}

function NewServiceForm({ onCreated, onCancel }: { onCreated: () => void; onCancel: () => void }) {
  const repository = useRepository();
  const business = useBusiness(CURRENT_BUSINESS_ID);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("60");
  const [price, setPrice] = useState("");

  function submit() {
    if (!business || !name.trim() || !price) return;
    repository.createService({
      businessId: business.id,
      name: name.trim(),
      description: "",
      durationMinutes: Number(duration) || 30,
      normalPrice: Number(price),
      category: business.category,
    });
    onCreated();
  }

  return (
    <div className="mt-3 space-y-2.5 rounded-[var(--radius-lg)] border border-border-strong bg-surface p-4">
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Service name" />
      <div className="flex gap-2.5">
        <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Minutes" />
        <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="€ Price" />
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={submit} disabled={!name.trim() || !price}>
          Add service
        </Button>
        <Button size="sm" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
