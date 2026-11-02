"use client";

import {
  EntityContainer,
  EntityHeader,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { DataTable } from "@/components/ui/data-table";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useAssetsParams } from "../hooks/use-asset-params";
import { useSuspenseAssets } from "../hooks/use-assets";
import { columns } from "./columns";
import { CreateAssetDialog } from "./create-asset-dialog";

export const AssetsSearch = () => {
  const [params, setParams] = useAssetsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search assets"
    />
  );
};

export const AssetsList = () => {
  const { data: assets, isFetching } = useSuspenseAssets();

  return (
    <DataTable
      paginatedData={assets}
      columns={columns}
      isLoading={isFetching}
      search={<AssetsSearch />}
    />
  );
};

export const AssetsHeader = () => {
  return (
    <EntityHeader
      title="Assets"
      description="Manage your hospital assets and devices"
      actions={<CreateAssetDialog />}
    />
  );
};

export const AssetsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer header={<AssetsHeader />}>{children}</EntityContainer>
  );
};

export const AssetsLoading = () => {
  return <LoadingView message="Loading assets..." />;
};

export const AssetsError = () => {
  return <ErrorView message="Error loading assets" />;
};
