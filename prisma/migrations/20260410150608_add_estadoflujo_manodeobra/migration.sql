-- AlterTable
ALTER TABLE "Orden_de_Trabajo" ADD COLUMN     "EstadoFlujo" VARCHAR(20) NOT NULL DEFAULT 'Pendiente',
ADD COLUMN     "ManoDeObra" DECIMAL(10,2);
