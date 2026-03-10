"use client";

import * as React from "react";

type FieldDef = {
    name: string;
    type: string;
    options?: string[];
    required?: boolean;
};

type SubcategoryDoc = {
    _id: string;
    subcategory: string;
    fields: FieldDef[];
};

type FiltersValue =
    | string
    | string[]
    | { min?: string; max?: string }
    | { make?: string; model?: string };

type FiltersState = Record<string, FiltersValue>;

function cleanOption(s: string) {
    return String(s ?? "").trim();
}

function isYesNoOptions(opts: string[]) {
    const a = opts.map((x) => cleanOption(x).toLowerCase()).filter(Boolean);
    if (a.length !== 2) return false;
    const set = new Set(a);
    return set.has("yes") && set.has("no");
}

/**
 * Decide which fields should appear as filters.
 * - We typically skip free-text fields like title/description/phone etc.
 * - We include: autocomplete/select/radio/multi-select/price/year/related-autocompletes
 */
function isFilterableField(f: FieldDef) {
    const t = String(f.type || "").toLowerCase();
    const name = String(f.name || "").toLowerCase();

    // skip obvious non-filters
    const skipByName = new Set([
        "title",
        "description",
        "phone",
        "youtube-link",
        "google location",
        "gps",
        "property area calcurator",
        "land area & location",
        "3d virtual property tour link",
        "virtualtourlink",
        "propertyarea",
        "delivery",
    ]);
    if (skipByName.has(name)) return false;

    // allow these types even without options
    if (["price", "rentprice", "year"].includes(t)) return true;

    // make-model special
    if (t === "related-autocompletes") return true;

    // allow option-based types
    if (["autocomplete", "radio", "select", "multi-select"].includes(t)) {
        return (f.options || []).filter((x) => cleanOption(x)).length > 0;
    }

    return false;
}

/**
 * For your make-model field, you stored options like:
 * "Make: Toyota\nModels: A, B, C\n\nMake: Nissan\nModels: X, Y"
 */
function parseMakeModelBlocks(raw: string) {
    const txt = String(raw || "");
    const blocks = txt.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

    const map: Record<string, string[]> = {};
    for (const b of blocks) {
        const makeMatch = b.match(/Make:\s*([^\n]+)/i);
        const modelMatch = b.match(/Models:\s*([\s\S]+)/i);
        const make = makeMatch ? cleanOption(makeMatch[1]) : "";
        const modelsStr = modelMatch ? modelMatch[1] : "";
        if (!make) continue;

        const models = modelsStr
            .split(",")
            .map((x) => cleanOption(x))
            .filter(Boolean);

        map[make] = models;
    }
    return map;
}

function formatLabel(name: string) {
    // turn "property-Type" => "Property Type"
    return String(name || "")
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getString(v: FiltersValue | undefined) {
    return typeof v === "string" ? v : "";
}
function getArray(v: FiltersValue | undefined) {
    return Array.isArray(v) ? v : [];
}

function Modal({
    open,
    onClose,
    title,
    children,
}: {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[80]">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-auto rounded-t-3xl bg-white shadow-2xl md:inset-y-10 md:mx-auto md:max-w-2xl md:rounded-3xl">
                <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
                    <div className="text-base font-extrabold text-slate-900">{title}</div>

                    <button
                        onClick={onClose}
                        className="rounded-full border p-2 hover:bg-orange-50"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}

function CheckboxList({
    options,
    value,
    onChange,
    searchable = false,
}: {
    options: string[];
    value: string[];
    onChange: (next: string[]) => void;
    searchable?: boolean;
}) {
    const [q, setQ] = React.useState("");
    const filtered = React.useMemo(() => {
        const base = options.map(cleanOption).filter(Boolean);
        if (!searchable) return base;
        const qq = q.trim().toLowerCase();
        if (!qq) return base;
        return base.filter((x) => x.toLowerCase().includes(qq));
    }, [options, q, searchable]);

    function toggle(opt: string) {
        const exists = value.includes(opt);
        const next = exists ? value.filter((x) => x !== opt) : [...value, opt];
        onChange(next);
    }

    return (
        <div className="space-y-2">
            {searchable && (
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search..."
                    className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                />
            )}

            <div className="max-h-56 space-y-2 overflow-auto pr-1">
                {filtered.map((opt) => {
                    const checked = value.includes(opt);
                    return (
                        <label
                            key={opt}
                            className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-2 hover:bg-orange-50"
                        >
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggle(opt)}
                                className="h-4 w-4 accent-orange-500"
                            />
                            <span className="text-sm font-semibold text-slate-800">{opt}</span>
                        </label>
                    );
                })}

                {filtered.length === 0 && (
                    <div className="text-sm font-semibold text-slate-500">No matches</div>
                )}
            </div>
        </div>
    );
}

function SelectBox({
    options,
    value,
    onChange,
    placeholder = "Any",
}: {
    options: string[];
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}) {
    const opts = options.map(cleanOption).filter(Boolean);
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-orange-200"
        >
            <option value="">{placeholder}</option>
            {opts.map((o) => (
                <option key={o} value={o}>
                    {o}
                </option>
            ))}
        </select>
    );
}

function RadioYesNo({
    value,
    onChange,
}: {
    value: string;
    onChange: (v: string) => void;
}) {
    const v = (value || "").toLowerCase();
    return (
        <div className="flex items-center gap-4">
            {["Yes", "No"].map((opt) => {
                const checked = v === opt.toLowerCase();
                return (
                    <label key={opt} className="flex cursor-pointer items-center gap-2 rounded-xl px-2 py-2 hover:bg-orange-50">
                        <input
                            type="radio"
                            name="yesno"
                            checked={checked}
                            onChange={() => onChange(opt)}
                            className="h-4 w-4 accent-orange-500"
                        />
                        <span className="text-sm font-semibold text-slate-800">{opt}</span>
                    </label>
                );
            })}

            <button
                type="button"
                onClick={() => onChange("")}
                className="ml-auto rounded-lg px-2 py-1 text-xs font-extrabold text-orange-700 hover:bg-orange-50 hover:underline"
            >
                Clear
            </button>
        </div>
    );
}

function PriceRange({
    value,
    onChange,
    labelMin = "Min",
    labelMax = "Max",
}: {
    value: { min?: string; max?: string };
    onChange: (v: { min?: string; max?: string }) => void;
    labelMin?: string;
    labelMax?: string;
}) {
    return (
        <div className="grid grid-cols-2 gap-2">
            <div>
                <div className="mb-1 text-xs font-extrabold text-slate-600">{labelMin}</div>
                <input
                    inputMode="numeric"
                    value={value.min || ""}
                    onChange={(e) => onChange({ ...value, min: e.target.value })}
                    className="w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="0"
                />
            </div>
            <div>
                <div className="mb-1 text-xs font-extrabold text-slate-600">{labelMax}</div>
                <input
                    inputMode="numeric"
                    value={value.max || ""}
                    onChange={(e) => onChange({ ...value, max: e.target.value })}
                    className="w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                    placeholder="Any"
                />
            </div>
        </div>
    );
}

function MakeModel({
    makeModelMap,
    value,
    onChange,
}: {
    makeModelMap: Record<string, string[]>;
    value: { make?: string; model?: string };
    onChange: (v: { make?: string; model?: string }) => void;
}) {
    const makes = React.useMemo(() => Object.keys(makeModelMap).sort(), [makeModelMap]);
    const models = React.useMemo(() => {
        const m = value.make ? makeModelMap[value.make] || [] : [];
        return [...m].sort();
    }, [makeModelMap, value.make]);

    return (
        <div className="space-y-2">
            <SelectBox
                options={makes}
                value={value.make || ""}
                onChange={(mk) => onChange({ make: mk || undefined, model: undefined })}
                placeholder="Any Make"
            />
            <SelectBox
                options={models}
                value={value.model || ""}
                onChange={(md) => onChange({ ...value, model: md || undefined })}
                placeholder={value.make ? "Any Model" : "Select make first"}
            />
            {(value.make || value.model) && (
                <button
                    type="button"
                    onClick={() => onChange({ make: undefined, model: undefined })}
                    className="rounded-lg px-2 py-1 text-xs font-extrabold text-orange-700 hover:bg-orange-50 hover:underline"
                >
                    Clear make/model
                </button>
            )}
        </div>
    );
}

function FiltersBody({
    subcategory,
    value,
    onChange,
}: {
    subcategory: SubcategoryDoc;
    value: FiltersState;
    onChange: (next: FiltersState) => void;
}) {
    const fields = React.useMemo(
        () => (subcategory.fields || []).filter(isFilterableField),
        [subcategory.fields]
    );

    function setField(name: string, v: FiltersValue) {
        const next = { ...value };
        const isEmpty =
            v === "" ||
            (Array.isArray(v) && v.length === 0) ||
            (typeof v === "object" && v !== null && Object.values(v).every((x) => !x));

        if (isEmpty) delete next[name];
        else next[name] = v;

        onChange(next);
    }

    return (
        <div className="space-y-4">
            {fields.map((f) => {
                const type = String(f.type || "").toLowerCase();
                const opts = (f.options || []).map(cleanOption).filter(Boolean);
                const label = formatLabel(f.name);

                return (
                    <div
                        key={f.name}
                        className="rounded-2xl border bg-white p-3 shadow-sm transition hover:shadow-md"
                    >
                        <div className="mb-2 flex items-center justify-between gap-2">
                            <div className="text-sm font-extrabold text-slate-900">{label}</div>
                            {value[f.name] ? (
                                <span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-extrabold text-orange-700 ring-1 ring-orange-200">
                                    Selected
                                </span>
                            ) : null}
                        </div>

                        {/* special: make-model */}
                        {type === "related-autocompletes" ? (
                            <MakeModel
                                makeModelMap={parseMakeModelBlocks(opts[0] || "")}
                                value={(value[f.name] as any) || {}}
                                onChange={(v) => setField(f.name, v)}
                            />
                        ) : null}

                        {/* price / rentprice */}
                        {type === "price" || type === "rentprice" ? (
                            <PriceRange
                                value={(value[f.name] as any) || {}}
                                onChange={(v) => setField(f.name, v)}
                            />
                        ) : null}

                        {/* year */}
                        {type === "year" ? (
                            <PriceRange
                                value={(value[f.name] as any) || {}}
                                onChange={(v) => setField(f.name, v)}
                                labelMin="From"
                                labelMax="To"
                            />
                        ) : null}

                        {/* yes/no radio */}
                        {["radio", "autocomplete", "select"].includes(type) &&
                            isYesNoOptions(opts) ? (
                            <RadioYesNo
                                value={getString(value[f.name])}
                                onChange={(v) => setField(f.name, v)}
                            />
                        ) : null}

                        {/* multi-select = checkbox list */}
                        {type === "multi-select" ? (
                            <CheckboxList
                                options={opts}
                                value={getArray(value[f.name])}
                                onChange={(arr) => setField(f.name, arr)}
                                searchable={opts.length > 12}
                            />
                        ) : null}

                        {/* other option-based fields */}
                        {["autocomplete", "select", "radio"].includes(type) &&
                            opts.length > 0 &&
                            !isYesNoOptions(opts) ? (
                            <>
                                {/* If you prefer “Jiji style” checkboxes for many options, change this rule */}
                                {opts.length <= 10 ? (
                                    <SelectBox
                                        options={opts}
                                        value={getString(value[f.name])}
                                        onChange={(v) => setField(f.name, v)}
                                    />
                                ) : (
                                    <CheckboxList
                                        options={opts}
                                        value={getArray(value[f.name])}
                                        onChange={(arr) => setField(f.name, arr)}
                                        searchable
                                    />
                                )}
                            </>
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
}

/**
 * MAIN COMPONENT
 */
export default function DynamicFilters({
    subcategory,
    value,
    onChange,
    onApply,
    onClear,
    title = "Filters",
}: {
    subcategory: SubcategoryDoc;
    value: FiltersState;
    onChange: (next: FiltersState) => void;
    onApply?: () => void; // optional: close modal / trigger search
    onClear?: () => void;
    title?: string;
}) {
    const [open, setOpen] = React.useState(false);

    function clearAll() {
        onChange({});
        onClear?.();
    }

    const body = (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={clearAll}
                    className="h-11 rounded-xl border px-4 text-sm font-extrabold text-slate-700 hover:bg-orange-50"
                >
                    Clear
                </button>

                <button
                    type="button"
                    onClick={() => {
                        onApply?.();
                        setOpen(false);
                    }}
                    className="ml-auto h-11 rounded-xl bg-orange-500 px-4 text-sm font-extrabold text-white shadow-sm hover:bg-orange-600"
                >
                    Apply
                </button>
            </div>

            <FiltersBody subcategory={subcategory} value={value} onChange={onChange} />
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <div className="sticky top-20 rounded-2xl border bg-white p-4 shadow-sm">
                    <div className="mb-3 text-base font-extrabold text-slate-900">
                        {title}
                    </div>
                    {body}
                </div>
            </div>

            {/* Mobile Button + Modal */}
            <div className="md:hidden">
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="w-full rounded-xl border bg-white px-4 py-3 text-sm font-extrabold text-slate-800 hover:bg-orange-50"
                >
                    More filters
                </button>

                <Modal open={open} onClose={() => setOpen(false)} title={title}>
                    {body}
                </Modal>
            </div>
        </>
    );
}