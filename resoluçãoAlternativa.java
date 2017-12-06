package retre;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class resoluçãoAlternativa {
	
	public static void main(String[] args) {
		// "input" gambiarra só pra testar desse jeito 
		boolean variaveis[] = new boolean[1];

		List<List<Integer>> clausulas = new ArrayList<List<Integer>>();
		
		List<Integer> cl1 = Arrays.asList(1, -2);
		List<Integer> cl2 = Arrays.asList(-1, -2);
		List<Integer> cl3 = Arrays.asList(-1, -2);
		
		clausulas.add(cl1);
		clausulas.add(cl2);
		clausulas.add(cl3);
		
		// fim do "input" gambiarra só pra testar
		
		boolean arrai[] = gerarPossibilidades(0, variaveis, clausulas);
		
		boolean isSat;
		boolean satisfyingCond[];
		
		if(arrai == null) {
			isSat = false;
			satisfyingCond = null;
		} else {
			isSat = true;
			satisfyingCond = arrai;
		}
		
		System.out.println(isSat);
		if(satisfyingCond == null) {
			System.out.println("null");
		} else {
			for(int i = 0; i < satisfyingCond.length; i++) {
				System.out.printf("%s%s", satisfyingCond[i] ? "T" : "F", i < satisfyingCond.length - 1 ? " | " : "\n");
			}
		}
	}
	// metodo auxiliar que testa uma permutação dada
	public static boolean testarPossibilidade(boolean variaveis[], List<List<Integer>> clausulas) {
		for (int i = 0; i < clausulas.size(); i++) {
			boolean c = false;
			List<Integer> clausula = clausulas.get(i);
			for (int j = 0; j < clausula.size(); j++) {
				int var = clausula.get(j);
				if (var < 0) {
					c = !variaveis[-var -1];
				} else {
					c = variaveis[var -1];
				}
				if (c) {
					break;
				}
			}
			if (!c) {
				return false;
			}
		}
		return true;
	}
	// tentativa de metodo recursivo que gerar as possibilidades
	// desse jeito independe da permutação anterior
	public static boolean[] gerarPossibilidades(int pos, boolean variaveis[], List<List<Integer>> clausulas) {
		boolean arrai[] = null;
		
		variaveis[pos] = false;
		if (pos + 1 < variaveis.length) {
			arrai = gerarPossibilidades(pos + 1, variaveis, clausulas);
		} else {
			if (testarPossibilidade(variaveis,clausulas)) {
				return variaveis;
			}
		}
		
		if(arrai != null) {
			return arrai;
		}
		
		variaveis[pos] = true;
		if (pos + 1 < variaveis.length) {
			arrai = gerarPossibilidades(pos + 1, variaveis, clausulas);
		} else {
			if (testarPossibilidade(variaveis,clausulas)) {
				return variaveis;
			}
		}
		
		return arrai;
	}

}
