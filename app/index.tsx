import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from "react-native";

interface Pokemon {
  name: string;
  image?: string | null;
  back?: string | null;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

const colorsByType: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetchPokemon();
  }, []);

  async function fetchPokemon() {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/?limit=100"
      );
      const data = await response.json();

      const detailedPokemon = await Promise.all(
        data.results.map(async (pokemon: { name: string; url: string }) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();

          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            back: details.sprites.back_default,
            types: details.types,
          };
        })
      );

      setPokemons(detailedPokemon);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {pokemons.map((pokemon) => {
        const primaryType = pokemon.types[0].type.name;
        const color = colorsByType[primaryType] ?? "#999";

        return (
          <Link key={pokemon.name} href="/details">
            <View
              style={[
                styles.card,
                {
                  backgroundColor: color + "33",
                  paddingTop: 20,
                },
              ]}
            >
              <Text style={styles.name}>{pokemon.name}</Text>

              <View style={[styles.typeBadge, { backgroundColor: color }]}>
                <Text style={styles.typeText}>{primaryType}</Text>
              </View>

              <View style={styles.imageRow}>
                {pokemon.image && (
                  <Image
                    source={{ uri: pokemon.image }}
                    style={styles.image}
                  />
                )}
              </View>
            </View>
          </Link>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
    alignItems: "center",
  },

  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 18,
    padding: 12,
    alignItems: "center",

    // subtle depth
    elevation: 4, // Android
    shadowColor: "#000", // iOS
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    textTransform: "capitalize",
    marginBottom: 6,
  },

  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },

  typeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  imageRow: {
    flexDirection: "row",
    gap: 8,
  },

  image: {
    width: 120,
    height: 120,
  },
});
 