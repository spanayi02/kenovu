"use client";

import { ScreenHeader } from "@/components/shared/ScreenHeader";
import { useCustomerProfile, useRepository } from "@/app-state/hooks";
import { CATEGORY_LABELS, DISTANCE_OPTIONS_KM } from "@/domain/constants";
import { SERVICE_CATEGORIES, type ServiceCategory } from "@/domain/types";
import { cn } from "@/lib/utils";

const AVAILABILITY_OPTIONS: { id: "any" | "morning" | "afternoon" | "after17"; label: string }[] = [
  { id: "any", label: "Any time" },
  { id: "morning", label: "Morning" },
  { id: "afternoon", label: "Afternoon" },
  { id: "after17", label: "After 17:00" },
];

const SAVING_OPTIONS: { id: 0 | 10 | 20 | 30; label: string }[] = [
  { id: 0, label: "Any" },
  { id: 10, label: "10%+" },
  { id: 20, label: "20%+" },
  { id: 30, label: "30%+" },
];

function OptionPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border-strong bg-surface text-foreground hover:bg-surface-muted",
      )}
    >
      {children}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-5 first:border-t-0 first:pt-0">
      <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ProfilePage() {
  const profile = useCustomerProfile();
  const repository = useRepository();

  function toggleCategory(category: ServiceCategory) {
    const has = profile.preferences.categories.includes(category);
    repository.updateCustomerPreferences({
      categories: has
        ? profile.preferences.categories.filter((c) => c !== category)
        : [...profile.preferences.categories, category],
    });
  }

  return (
    <div>
      <ScreenHeader title="Profile" />
      <div className="mx-auto max-w-xl px-4 pt-4 pb-10">
        <div className="flex items-center gap-3 pb-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-tint text-lg font-bold text-primary">
            {profile.avatarInitials}
          </div>
          <div>
            <p className="text-[17px] font-bold text-foreground">{profile.name}</p>
            <p className="text-[13.5px] text-muted-foreground">{profile.homeArea}, Nicosia</p>
          </div>
        </div>

        <Section title="Preferred categories">
          <div className="flex flex-wrap gap-2">
            {SERVICE_CATEGORIES.map((category) => (
              <OptionPill
                key={category}
                active={profile.preferences.categories.includes(category)}
                onClick={() => toggleCategory(category)}
              >
                {CATEGORY_LABELS[category]}
              </OptionPill>
            ))}
          </div>
        </Section>

        <Section title="Distance">
          <div className="flex flex-wrap gap-2">
            <OptionPill
              active={profile.preferences.maxDistanceKm === null}
              onClick={() => repository.updateCustomerPreferences({ maxDistanceKm: null })}
            >
              Any
            </OptionPill>
            {DISTANCE_OPTIONS_KM.map((km) => (
              <OptionPill
                key={km}
                active={profile.preferences.maxDistanceKm === km}
                onClick={() => repository.updateCustomerPreferences({ maxDistanceKm: km })}
              >
                {km} km
              </OptionPill>
            ))}
          </div>
        </Section>

        <Section title="Preferred availability">
          <div className="flex flex-wrap gap-2">
            {AVAILABILITY_OPTIONS.map((opt) => (
              <OptionPill
                key={opt.id}
                active={profile.preferences.availability === opt.id}
                onClick={() => repository.updateCustomerPreferences({ availability: opt.id })}
              >
                {opt.label}
              </OptionPill>
            ))}
          </div>
        </Section>

        <Section title="Minimum saving">
          <div className="flex flex-wrap gap-2">
            {SAVING_OPTIONS.map((opt) => (
              <OptionPill
                key={opt.id}
                active={profile.preferences.minSavingPercent === opt.id}
                onClick={() => repository.updateCustomerPreferences({ minSavingPercent: opt.id })}
              >
                {opt.label}
              </OptionPill>
            ))}
          </div>
        </Section>

        <Section title="Notifications">
          <label className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-border p-4">
            <div>
              <p className="text-[14.5px] font-medium text-foreground">Last-minute alerts</p>
              <p className="text-[13px] text-muted-foreground">
                Notify me about saved businesses and matching preferences
              </p>
            </div>
            <input
              type="checkbox"
              checked={profile.notificationPreferences.enabled}
              onChange={(e) =>
                repository.updateNotificationPreferences({ enabled: e.target.checked })
              }
              className="h-5 w-5 shrink-0 accent-primary"
            />
          </label>
        </Section>
      </div>
    </div>
  );
}
