import { Request, Response } from 'express';
import * as packetService from '../services/packet.service';

export const getAll = async (req: Request, res: Response) => {
  const tournamentId = req.query.tournamentId ? parseInt(req.query.tournamentId as string) : undefined;
  const packets = await packetService.getAll(tournamentId);
  res.json(packets);
};

export const getById = async (req: Request, res: Response) => {
  const packet = await packetService.getById(parseInt(req.params.id));
  if (!packet) {
    return res.status(404).json({ error: 'Packet not found' });
  }
  res.json(packet);
};

export const create = async (req: Request, res: Response) => {
  try {
    const packet = await packetService.create(req.body);
    res.status(201).json(packet);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const packet = await packetService.update(parseInt(req.params.id), req.body);
    res.json(packet);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await packetService.remove(parseInt(req.params.id));
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const packetize = async (req: Request, res: Response) => {
  try {
    const packet = await packetService.packetize(parseInt(req.params.id));
    res.json(packet);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
