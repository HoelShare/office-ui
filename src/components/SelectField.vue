<template>
  <div class="select-field">
    <select :value="value" @input="$emit('input', $event.target.value)">
      <option
        v-for="item in list"
        :key="item[valueField]"
        :value="item[valueField]"
      >
        {{ item[labelField] }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { types } from '@/store/entity-api';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapActions, mapState } from 'vuex';

@Component({
  computed: {
    ...mapState({
      list(state: any): any {
        return state[this.entity].list;
      },
    }),
  },
  methods: mapActions({
    fetchList(dispatch) {
      return dispatch(`${this.entity}/${types.FETCH_LIST}`);
    },
  }),
})
export default class SelectField extends Vue {
  @Prop({ required: true }) private entity!: string;

  @Prop({ required: false, default: 'name' }) private labelField!: string;

  @Prop({ required: false, default: 'id' }) private valueField!: string;

  @Prop({ required: true }) private value!: any;

  private list!: Array<object>;

  private fetchList!: () => Promise<Array<object>>;

  mounted() {
    this.fetchList();
  }
}
</script>

<style scoped lang="scss">
</style>
