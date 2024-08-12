import { recalculateMetaphors } from './recalculate-metaphors';
import { setDirector, setMetaphorSelection } from '../data';
import { setVisualizationData } from '../data';

export default class Director {
   constructor(cityMetaphor) {
      setDirector(this);

      this.cityMetaphor = cityMetaphor;
      this.builders = [];
      this.renderer = null;
      this.scene = null;
      this.camera = null;
      this.cityElements = [];
      this.gui = null;
   }

   registerBuilder(builder) {
      this.builders.push(builder);
   }

   constructCity() {
      this.builders.forEach((builder) => {
         switch (builder.constructor.name) {
            case 'EnvironmentBuilder':
               builder.setCityMetaphor(this.cityMetaphor);
               const { renderer, scene, camera } = builder.build();
               this.renderer = renderer;
               this.scene = scene;
               this.camera = camera;
               break;
            case 'CityElementBuilder':
               builder.setCityMetaphor(this.cityMetaphor);
               builder.setScene(this.scene);
               const cityElements = builder.build();
               this.cityElements = cityElements;
               break;
            case 'ModelTreeBuilder':
               builder.setCityMetaphor(this.cityMetaphor);
               builder.setCityElements(this.cityElements);
               this.builders
                  .find((b) => b.constructor.name === 'EnvironmentBuilder')
                  .setModelTreeBuilder(builder);
               const modelTree = builder.build();
               const modelTreeFrame = document.getElementById('model-tree');
               modelTreeFrame.appendChild(modelTree);
               break;
            case 'SliderBuilder':
               builder.setCityMetaphor(this.cityMetaphor);
               builder.setCityElements(this.cityElements);
               builder.setModelTreeBuilder(
                  this.builders.find(
                     (b) => b.constructor.name === 'ModelTreeBuilder',
                  ),
               );
               this.builders
                  .find((b) => b.constructor.name === 'ModelTreeBuilder')
                  .setSliderBuilder(builder);
               builder.build();
               break;
            case 'InfoPanelBuilder':
               builder.setCityMetaphor(this.cityMetaphor);
               builder.setCityElements(this.cityElements);
               this.builders
                  .find((b) => b.constructor.name === 'EnvironmentBuilder')
                  .setInfoPanelBuilder(builder);
               break;
            case 'GuiBuilder':
               builder.setCityMetaphor(this.cityMetaphor);
               builder.setCityElements(this.cityElements);
               builder.setModelTreeBuilder(
                  this.builders.find(
                     (b) => b.constructor.name === 'ModelTreeBuilder',
                  ),
               );
               this.builders
                  .find((b) => b.constructor.name === 'ModelTreeBuilder')
                  .setGuiBuilder(builder);
               builder.setSliderBuilder(
                  this.builders.find(
                     (b) => b.constructor.name === 'SliderBuilder',
                  ),
               );
               this.builders
                  .find((b) => b.constructor.name === 'SliderBuilder')
                  .setGuiBuilder(builder);
               this.gui = builder.build();
               break;
            default:
               throw new Error(`Unknown builder: ${builder.constructor.name}`);
         }
      });

      const modelTreeBuilder = this.builders.find(
         (b) => b.constructor.name === 'ModelTreeBuilder',
      );

      const sliderBuilder = this.builders.find(
         (b) => b.constructor.name === 'SliderBuilder',
      );
      const guiBuilder = this.builders.find(
         (b) => b.constructor.name === 'GuiBuilder',
      );
      recalculateMetaphors(
         this.cityMetaphor,
         this.cityElements,
         modelTreeBuilder,
         sliderBuilder,
         guiBuilder,
      );
   }

   destroyCity() {
      this.builders.forEach((builder) => {
         if (builder.destroy) {
            builder.destroy();
         }
      });

      // Reset metaphor selection in data store
      setMetaphorSelection({});

      // Reset visualization data in data store
      setVisualizationData([]);

      setDirector(null);
   }
}
