import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface ProductFeatureManagerProps {
  features: string[];
  onChange: (features: string[]) => void;
}

const ProductFeatureManager = ({
  features,
  onChange,
}: ProductFeatureManagerProps) => {
  const [newFeature, setNewFeature] = useState("");
  const [featureCategory, setFeatureCategory] = useState("");
  const [showCategories, setShowCategories] = useState(false);

  // Group features by category if they have a category prefix (e.g., "Performance: Fast loading")
  const categorizedFeatures = features.reduce<Record<string, string[]>>(
    (acc, feature) => {
      const categoryMatch = feature.match(/^([^:]+):\s*(.+)$/);
      if (categoryMatch) {
        const [, category, featureText] = categoryMatch;
        if (!acc[category]) acc[category] = [];
        acc[category].push(feature);
      } else {
        if (!acc["General"]) acc["General"] = [];
        acc["General"].push(feature);
      }
      return acc;
    },
    {},
  );

  const handleAddFeature = () => {
    if (newFeature.trim() === "") return;

    let featureToAdd = newFeature;
    if (featureCategory && featureCategory !== "General") {
      featureToAdd = `${featureCategory}: ${newFeature}`;
    }

    onChange([...features, featureToAdd]);
    setNewFeature("");
  };

  const handleRemoveFeature = (index: number) => {
    const updatedFeatures = [...features];
    updatedFeatures.splice(index, 1);
    onChange(updatedFeatures);
  };

  const handleMoveFeature = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === features.length - 1)
    )
      return;

    const updatedFeatures = [...features];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [updatedFeatures[index], updatedFeatures[newIndex]] = [
      updatedFeatures[newIndex],
      updatedFeatures[index],
    ];
    onChange(updatedFeatures);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Product Features</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCategories(!showCategories)}
        >
          {showCategories ? "Hide Categories" : "Use Categories"}
        </Button>
      </div>

      <div className="flex space-x-2">
        {showCategories && (
          <div className="w-1/3">
            <Input
              value={featureCategory}
              onChange={(e) => setFeatureCategory(e.target.value)}
              placeholder="Category (optional)"
            />
          </div>
        )}
        <div className={showCategories ? "w-2/3" : "w-full"}>
          <div className="flex space-x-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a feature"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddFeature();
                }
              }}
            />
            <Button type="button" onClick={handleAddFeature}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {showCategories ? (
        // Display features grouped by category
        <div className="space-y-4">
          {Object.entries(categorizedFeatures).map(
            ([category, categoryFeatures]) => (
              <div key={category} className="space-y-2">
                <h4 className="font-medium text-sm">{category}</h4>
                {categoryFeatures.map((feature, index) => {
                  const featureIndex = features.indexOf(feature);
                  return (
                    <div
                      key={`${category}-${index}`}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                    >
                      <span>{feature.replace(/^[^:]+:\s*/, "")}</span>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMoveFeature(featureIndex, "up")}
                          disabled={featureIndex === 0}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleMoveFeature(featureIndex, "down")
                          }
                          disabled={featureIndex === features.length - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFeature(featureIndex)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ),
          )}
        </div>
      ) : (
        // Display features as a simple list
        <div className="mt-2 space-y-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
            >
              <span>{feature}</span>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMoveFeature(index, "up")}
                  disabled={index === 0}
                >
                  <MoveUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMoveFeature(index, "down")}
                  disabled={index === features.length - 1}
                >
                  <MoveDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFeature(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {features.length === 0 && (
        <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-md">
          No features added yet. Add some features to highlight your product.
        </div>
      )}
    </div>
  );
};

export default ProductFeatureManager;
