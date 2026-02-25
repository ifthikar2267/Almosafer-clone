"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { Filter } from "lucide-react";
import { fetchHotelFilters } from "@/services/hotel.service";
import Divider from "@mui/material/Divider";

const TEAL = "#0d9488";

export default function FilterSidebar({
  staysCount = 0,
  cityName = "All destinations",
  selectedAreas = [],
  selectedTypes = [],
  selectedStarRatings = [],
  selectedChains = [],
  selectedAmenityNames = [],
  onAreaChange,
  onTypeChange,
  onStarRatingChange,
  onChainChange,
  onAmenityChange,
  onClearAll,
  filterOptions: filterOptionsProp,
  showClearAll = true,
}) {
  const [filterOptionsState, setFilterOptionsState] = useState({
    types: [],
    areas: [],
    starRatings: [],
    propertyTypes: [],
    chains: [],
    amenities: [],
  });
  const [filtersLoading, setFiltersLoading] = useState(!filterOptionsProp);

  useEffect(() => {
    const hasProp =
      filterOptionsProp?.areas?.length ||
      filterOptionsProp?.propertyTypes?.length ||
      filterOptionsProp?.starRatings?.length ||
      filterOptionsProp?.chains?.length ||
      filterOptionsProp?.amenities?.length;
    if (hasProp) {
      setFilterOptionsState({
        types: filterOptionsProp.types || filterOptionsProp.propertyTypes || [],
        areas: filterOptionsProp.areas || [],
        starRatings: filterOptionsProp.starRatings || [],
        propertyTypes:
          filterOptionsProp.propertyTypes || filterOptionsProp.types || [],
        chains: filterOptionsProp.chains || [],
        amenities: filterOptionsProp.amenities || [],
      });
      setFiltersLoading(false);
      return;
    }
    let cancelled = false;
    setFiltersLoading(true);
    fetchHotelFilters()
      .then((data) => {
        if (!cancelled) {
          setFilterOptionsState({
            types: data.types || [],
            areas: data.areas || [],
            starRatings: data.starRatings || [],
            propertyTypes: data.propertyTypes || data.types || [],
            chains: data.chains || [],
            amenities: data.amenities || [],
          });
        }
      })
      .catch(() => {
        if (!cancelled)
          setFilterOptionsState({
            types: [],
            areas: [],
            starRatings: [],
            propertyTypes: [],
            chains: [],
            amenities: [],
          });
      })
      .finally(() => {
        if (!cancelled) setFiltersLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filterOptionsProp]);

  const hasPropOptions =
    filterOptionsProp?.areas?.length ||
    filterOptionsProp?.propertyTypes?.length ||
    filterOptionsProp?.starRatings?.length ||
    filterOptionsProp?.chains?.length ||
    filterOptionsProp?.amenities?.length;
  const options = hasPropOptions
    ? {
        types: filterOptionsProp.types || filterOptionsProp.propertyTypes || [],
        areas: filterOptionsProp.areas || [],
        starRatings: filterOptionsProp.starRatings || [],
        propertyTypes:
          filterOptionsProp.propertyTypes || filterOptionsProp.types || [],
        chains: filterOptionsProp.chains || [],
        amenities: filterOptionsProp.amenities || [],
      }
    : filterOptionsState;

  const types = options.propertyTypes?.length
    ? options.propertyTypes
    : options.types;
  const areas = options.areas || [];
  const starRatings = options.starRatings || [];
  const chains = options.chains || [];
  const amenities = options.amenities || [];

  const handleStarToggle = (value) => {
    const next = selectedStarRatings.includes(value)
      ? selectedStarRatings.filter((s) => s !== value)
      : [...selectedStarRatings, value];
    onStarRatingChange?.(next);
  };

  const handleAmenityToggle = (name) => {
    const next = selectedAmenityNames.includes(name)
      ? selectedAmenityNames.filter((n) => n !== name)
      : [...selectedAmenityNames, name];
    onAmenityChange?.(next);
  };

  const handleAreaToggle = (name) => {
    const isSelected = selectedAreas.includes(name);
    const next = isSelected
      ? selectedAreas.filter((v) => v !== name)
      : [...selectedAreas, name];
    // Debug: ensure we send the full next selection to parent
    // console.log("[FilterSidebar] Area toggle", { name, next });
    onAreaChange?.(next);
  };

  const handleTypeToggle = (name) => {
    const isSelected = selectedTypes.includes(name);
    const next = isSelected
      ? selectedTypes.filter((v) => v !== name)
      : [...selectedTypes, name];
    // console.log("[FilterSidebar] Type toggle", { name, next });
    onTypeChange?.(next);
  };

  const handleChainToggle = (name) => {
    const isSelected = selectedChains.includes(name);
    const next = isSelected
      ? selectedChains.filter((v) => v !== name)
      : [...selectedChains, name];
    // console.log("[FilterSidebar] Chain toggle", { name, next });
    onChainChange?.(next);
  };

  const hasActiveFilters =
    selectedAreas.length > 0 ||
    selectedTypes.length > 0 ||
    selectedStarRatings.length > 0 ||
    selectedChains.length > 0 ||
    selectedAmenityNames.length > 0;

  return (
    <Box className="space-y-4">
      <Box className="p-4" sx={{ textAlign: "start" }}>
        <Box className="mb-3 flex items-center gap-2">
          <Filter size={20} style={{ color: TEAL }} />
          <Typography
            variant="h6"
            fontWeight={700}
            color="text.primary"
            sx={{ fontSize: "1rem" }}
          >
            Filters
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" className="mb-4">
          {staysCount > 0
            ? `${staysCount} properties in ${cityName}`
            : `Properties in ${cityName}`}
        </Typography>

        {showClearAll && hasActiveFilters && (
          <Button
            size="small"
            variant="outlined"
            onClick={onClearAll}
            className="mb-4 rounded-lg"
            sx={{
              borderColor: "#9ca3af",
              color: "#6b7280",
              "&:hover": { borderColor: "#6b7280", bgcolor: "#f3f4f6" },
            }}
          >
            Clear all filters
          </Button>
        )}

        {filtersLoading ? (
          <Box className="flex justify-center py-4">
            <CircularProgress size={28} sx={{ color: TEAL }} />
          </Box>
        ) : (
          <>
            {/* Star rating */}
            {starRatings.length > 0 && (
              <>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mb: 1,
                    mt: 2,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#333333",
                  }}
                >
                  Star rating
                </Typography>
                <FormGroup sx={{ mb: 2 }}>
                  {starRatings.map((s) => (
                    <FormControlLabel
                      key={s.value}
                      control={
                        <Checkbox
                          size="small"
                          checked={selectedStarRatings.includes(s.value)}
                          onChange={() => handleStarToggle(s.value)}
                          sx={{ "&.Mui-checked": { color: TEAL } }}
                        />
                      }
                      label={
                        <Box className="flex w-full justify-between">
                          <Typography variant="body2">
                            {s.value} stars
                          </Typography>
                          {s.count != null && (
                            <Typography variant="body2" color="text.secondary">
                              ({s.count})
                            </Typography>
                          )}
                        </Box>
                      }
                      sx={{ mr: 0 }}
                    />
                  ))}
                </FormGroup>
              </>
            )}
            <Divider sx={{ my: 2, borderColor: "gray.200" }} />

            {/* Area – checkbox grid */}
            {/* Area */}
            {areas.length > 0 && (
              <>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#333333",
                  }}
                >
                  Districts
                </Typography>

                <Box className="max-h-48 overflow-y-auto p-2 mb-4">
                  <FormGroup>
                    {areas.map((area) => (
                      <FormControlLabel
                        key={area.id}
                        control={
                          <Checkbox
                            size="small"
                            checked={selectedAreas.includes(area.name)}
                            onChange={() => handleAreaToggle(area.name)}
                            sx={{ "&.Mui-checked": { color: TEAL } }}
                          />
                        }
                        label={
                          <Box className="flex w-full justify-between">
                            <Typography variant="body2">{area.name}</Typography>
                            {area.count != null && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                ({area.count})
                              </Typography>
                            )}
                          </Box>
                        }
                        sx={{ mr: 0 }}
                      />
                    ))}
                  </FormGroup>
                </Box>
              </>
            )}
            {/* Divider */}
            <Divider sx={{ my: 2, borderColor: "gray.200" }} />

            {/* Type */}
            {types.length > 0 && (
              <>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#333333",
                  }}
                >
                  Property Type
                </Typography>

                <Box className="max-h-48 overflow-y-auto p-2 mb-4">
                  <FormGroup>
                    {types.map((type) => (
                      <FormControlLabel
                        key={type.id}
                        control={
                          <Checkbox
                            size="small"
                            checked={selectedTypes.includes(type.name)}
                            onChange={() => handleTypeToggle(type.name)}
                            sx={{ "&.Mui-checked": { color: TEAL } }}
                          />
                        }
                        label={
                          <Box className="flex w-full justify-between">
                            <Typography variant="body2">{type.name}</Typography>
                            {type.count != null && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                ({type.count})
                              </Typography>
                            )}
                          </Box>
                        }
                        sx={{ mr: 0 }}
                      />
                    ))}
                  </FormGroup>
                </Box>
              </>
            )}

            {/* Divider */}
            <Divider sx={{ my: 2, borderColor: "gray.200" }} />

            {/* Chain */}
            {chains.length > 0 && (
              <>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#333333",
                  }}
                >
                  Chains
                </Typography>

                <Box className="max-h-48 overflow-y-auto p-2 mb-4">
                  <FormGroup>
                    {chains.map((chain) => (
                      <FormControlLabel
                        key={chain.id}
                        control={
                          <Checkbox
                            size="small"
                            checked={selectedChains.includes(chain.name)}
                            onChange={() => handleChainToggle(chain.name)}
                            sx={{ "&.Mui-checked": { color: TEAL } }}
                          />
                        }
                        label={
                          <Box className="flex w-full justify-between">
                            <Typography variant="body2">
                              {chain.name}
                            </Typography>
                            {chain.count != null && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                ({chain.count})
                              </Typography>
                            )}
                          </Box>
                        }
                        sx={{ mr: 0 }}
                      />
                    ))}
                  </FormGroup>
                </Box>
              </>
            )}

            {/* Divider */}
            <Divider sx={{ my: 2, borderColor: "gray.200" }} />

            {/* Amenities checkbox list */}
            {amenities.length > 0 && (
              <>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#333333",
                  }}
                >
                  Property Amenity
                </Typography>
                <Box className="max-h-48 overflow-y-auto p-2">
                  <FormGroup>
                    {amenities.map((a) => (
                      <FormControlLabel
                        key={a.id}
                        control={
                          <Checkbox
                            size="small"
                            checked={selectedAmenityNames.includes(a.name)}
                            onChange={() => handleAmenityToggle(a.name)}
                            sx={{ "&.Mui-checked": { color: TEAL } }}
                          />
                        }
                        label={
                          <Box className="flex w-full justify-between">
                            <Typography variant="body2">{a.name}</Typography>
                            {a.count != null && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                ({a.count})
                              </Typography>
                            )}
                          </Box>
                        }
                        sx={{ mr: 0 }}
                      />
                    ))}
                  </FormGroup>
                </Box>
              </>
            )}

            {areas.length === 0 &&
              types.length === 0 &&
              starRatings.length === 0 &&
              chains.length === 0 &&
              amenities.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  No filter options. Try a different search.
                </Typography>
              )}
          </>
        )}
      </Box>
    </Box>
  );
}
