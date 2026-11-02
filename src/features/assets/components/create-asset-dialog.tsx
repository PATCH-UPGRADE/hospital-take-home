"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VersionStatus } from "@/generated/prisma";
import { useCreateAsset } from "../hooks/use-assets";
import { assetInputObjectSchema } from "../types";

// Text inputs hold "" rather than null, so the optional fields accept a blank
// string here and are sent to the API as null. versionStatus only applies when
// the version is blank: a version makes the asset KNOWN.
const formSchema = assetInputObjectSchema.extend({
  deviceType: z.string().trim(),
  version: z.string().trim(),
  versionStatus: z.enum([VersionStatus.UNKNOWN, VersionStatus.NOT_APPLICABLE]),
});
type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  ip: "",
  deviceType: "",
  manufacturer: "",
  product: "",
  version: "",
  versionStatus: VersionStatus.UNKNOWN,
};

const fields: {
  name: Exclude<keyof FormValues, "versionStatus">;
  label: string;
  placeholder: string;
  required?: boolean;
}[] = [
  {
    name: "ip",
    label: "IP Address",
    placeholder: "10.10.1.11",
    required: true,
  },
  { name: "deviceType", label: "Device Type", placeholder: "Infusion Pump" },
  {
    name: "manufacturer",
    label: "Manufacturer",
    placeholder: "BD",
    required: true,
  },
  {
    name: "product",
    label: "Product",
    placeholder: "Alaris 8015 PC Unit",
    required: true,
  },
  { name: "version", label: "Version", placeholder: "12.1.2" },
];

export const CreateAssetDialog = () => {
  const [open, setOpen] = useState(false);
  const createAsset = useCreateAsset();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) form.reset(defaultValues);
  };

  const hasVersion = form.watch("version") !== "";

  const onSubmit = ({ version, versionStatus, ...values }: FormValues) => {
    createAsset.mutate(
      {
        ...values,
        deviceType: values.deviceType || null,
        ...(version ? { version } : { version: null, versionStatus }),
      },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="size-4" />
          New Asset
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Asset</DialogTitle>
          <DialogDescription>
            Add a device on the hospital network.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {fields.map((spec) => (
              <FormField
                key={spec.name}
                control={form.control}
                name={spec.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {spec.label}
                      {spec.required ? " *" : ""}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={spec.placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            {!hasVersion && (
              <FormField
                control={form.control}
                name="versionStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={VersionStatus.UNKNOWN}>
                          Unknown: the device has a version nobody knows
                        </SelectItem>
                        <SelectItem value={VersionStatus.NOT_APPLICABLE}>
                          Not applicable: the product has no versions
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={createAsset.isPending}>
                {createAsset.isPending ? "Creating..." : "Create Asset"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
