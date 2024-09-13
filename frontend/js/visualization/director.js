import EnvironmentBuilder from "./environment-builder";
import SliderBuilder from "./slider-builder";
import ModelTreeBuilder from "./model-tree-builder";
import InfoPanelBuilder from "./info-panel-builder";
import GuiBuilder from "./gui-builder";
import PlaneBuilder from "./plane-builder";
import BuildingBuilder from "./building-builder";
import DimensionsBuilder from "./dimensions-builder";
import HierarchyBuilder from "./hierarchy-builder";
import PositionBuilder from "./position-builder";
import AggregateBuilder from "./aggregate-builder";
import { recalculateController } from "./aggregates/recalculate-controller";
import { setDirector, setMetaphorSelection } from "../data";
import { setVisualizationData } from "../data";

export default class Director {
   constructor(cityMetaphor, data) {
      setDirector(this);

      this.cityMetaphor = cityMetaphor;
      this.data = data;

      this.environmentBuilder = new EnvironmentBuilder(this.cityMetaphor);
      this.sliderBuilder = new SliderBuilder(this.data, this.cityMetaphor);
      this.modelTreeBuilder = new ModelTreeBuilder(this.cityMetaphor);
      this.infoPanelBuilder = new InfoPanelBuilder(this.cityMetaphor);
      this.guiBuilder = new GuiBuilder(this.data, this.cityMetaphor);
      this.aggregateBuilder = new AggregateBuilder();

      this.dimensionsBuilder = new DimensionsBuilder(this.cityMetaphor);
      this.hierarchyBuilder = new HierarchyBuilder();
      this.positionBuilder = new PositionBuilder();

      this.optionalBuilders = [];

      cityMetaphor.descriptors.forEach((descriptor) => {
         switch (descriptor.type) {
            case "PlaneDescriptor":
               this.optionalBuilders.push(new PlaneBuilder());
               break;
            case "BuildingDescriptor":
               this.optionalBuilders.push(new BuildingBuilder(this.data));
               break;
            default:
               console.error("Unimplemented descriptor type");
               break;
         }
      });

      this.scene = null;
      this.camera = null;
      this.gui = null;
   }

   constructCity() {
      const { scene, camera } = this.environmentBuilder.build();
      this.scene = scene;
      this.camera = camera;

      switch (this.cityMetaphor.type) {
         case "BasicCityMetaphor":
            const planeBuilder = this.optionalBuilders.find((builder) => {
               return builder.type === "PlaneBuilder";
            });
            const buildingBuilder = this.optionalBuilders.find((builder) => {
               return builder.type === "BuildingBuilder";
            });

            this.buildings = buildingBuilder.build();

            this.dimensionsBuilder.build(this.buildings);

            this.planes = planeBuilder.build(this.buildings);

            this.hierarchyBuilder.build(this.buildings, this.planes);

            this.positionBuilder.build(this.buildings, this.planes);

            this.scene.add(planeBuilder.planes[0]);

            break;
         default:
            break;
      }

      this.modelTreeBuilder.setCityElements(this.buildings, this.planes);
      this.modelTreeBuilder.setInfoPanelBuilder(this.infoPanelBuilder);
      const modelTree = this.modelTreeBuilder.build();
      const modelTreeFrame = document.getElementById("model-tree");
      modelTreeFrame.appendChild(modelTree);
      this.environmentBuilder.setModelTreeBuilder(this.modelTreeBuilder);

      this.sliderBuilder.setCityElements(this.buildings, this.planes);
      this.sliderBuilder.setModelTreeBuilder(this.modelTreeBuilder);
      this.modelTreeBuilder.setSliderBuilder(this.sliderBuilder);
      this.sliderBuilder.setInfoPanelBuilder(this.infoPanelBuilder);
      this.sliderBuilder.build();

      this.infoPanelBuilder.setCityElements(this.buildings, this.planes);
      this.environmentBuilder.setInfoPanelBuilder(this.infoPanelBuilder);

      this.guiBuilder.setCityElements(this.buildings, this.planes);
      this.guiBuilder.setModelTreeBuilder(this.modelTreeBuilder);
      this.modelTreeBuilder.setGuiBuilder(this.guiBuilder);
      this.guiBuilder.setSliderBuilder(this.sliderBuilder);
      this.sliderBuilder.setGuiBuilder(this.guiBuilder);
      this.guiBuilder.setInfoPanelBuilder(this.infoPanelBuilder);
      this.gui = this.guiBuilder.build(this.data);

      this.aggregateBuilder.build();

      recalculateController(
         this.cityMetaphor,
         [...this.buildings, ...this.planes],
         this.modelTreeBuilder,
         this.sliderBuilder,
         this.guiBuilder,
         this.infoPanelBuilder
      );
   }

   destroyCity() {
      this.environmentBuilder.destroy();
      this.sliderBuilder.destroy();
      this.modelTreeBuilder.destroy();
      this.infoPanelBuilder.destroy();
      this.guiBuilder.destroy();
      this.aggregateBuilder.destroy();
      this.dimensionsBuilder.destroy();
      this.hierarchyBuilder.destroy();
      this.positionBuilder.destroy();

      this.optionalBuilders.forEach((builder) => {
         builder.destroy();
      });

      setMetaphorSelection({});

      setVisualizationData([]);

      setDirector(null);
   }
}
