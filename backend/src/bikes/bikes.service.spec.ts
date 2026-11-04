import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { BikesRepository } from "./bikes.repository";
import { BikesService } from "./bikes.service";
import type { BikeModel } from "./models/bike.model";
import {
  BikeHasSalesError,
  BikeNotFoundError,
} from "./models/persistence-error.model";

const bike: BikeModel = {
  id: "bike-id",
  brand: "Veloria",
  model: "City 100",
  description: "Vélo de ville",
  category: "city",
  frameMaterial: "aluminium",
  frameSizeCm: 54,
  wheelSizeInches: 28,
  gearCount: 7,
  weightKg: 14.2,
  electric: false,
  priceCents: 49900,
};

function setup() {
  const repository = {
    findAll: vi.fn<BikesRepository["findAll"]>(),
    findById: vi.fn<BikesRepository["findById"]>(),
    create: vi.fn<BikesRepository["create"]>(),
    update: vi.fn<BikesRepository["update"]>(),
    delete: vi.fn<BikesRepository["delete"]>(),
  };
  const service = new BikesService(repository as unknown as BikesRepository);
  return { repository, service };
}

describe("BikesService", () => {
  it("passes pagination to the repository and returns its page", async () => {
    const { repository, service } = setup();
    const page = { totalCount: 1, items: [bike] };
    repository.findAll.mockResolvedValue(page);
    expect(await service.findAll({ page: 2, limit: 5 })).toEqual(page);
    expect(repository.findAll).toHaveBeenCalledWith({ page: 2, limit: 5 });
  });

  it("returns 404 for a missing bike on read, update and delete", async () => {
    const { repository, service } = setup();
    repository.findById.mockResolvedValue(null);
    await expect(service.findById(bike.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    repository.update.mockRejectedValue(new BikeNotFoundError());
    await expect(
      service.update(bike.id, { brand: "Other" }),
    ).rejects.toBeInstanceOf(NotFoundException);
    repository.delete.mockRejectedValue(new BikeNotFoundError());
    await expect(service.delete(bike.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("returns 409 when deleting a bike that has sales", async () => {
    const { repository, service } = setup();
    repository.delete.mockRejectedValue(new BikeHasSalesError());
    await expect(service.delete(bike.id)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it("rejects empty patches without reaching the repository", async () => {
    const { repository, service } = setup();
    await expect(service.update(bike.id, {})).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(
      service.update(bike.id, { brand: undefined }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(repository.update).not.toHaveBeenCalled();
  });
});
